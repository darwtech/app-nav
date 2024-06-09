import './style.css';
import { listarSocios, insertarSocio, eliminarSocio, calcularEdad } from './controllers/socioController';
import { listarBarcos, insertarBarco, eliminarBarco } from './controllers/barcoController';
import { Socio } from './models/Socio';
import { Barco } from './models/Barco';
import Swal from 'sweetalert2';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const sideNav = document.getElementById('sideNav');
    const dashboardContainer = document.getElementById('dashboardContainer');
    const socioFormContainer = document.getElementById('socioFormContainer');
    const barcoFormContainer = document.getElementById('barcoFormContainer');
    const menuItems = document.querySelectorAll('.menu-item');

    let modal: ModalInterface | null = null;

    const toggleClass = (element: HTMLElement | null, className: string, condition: boolean) => {
        if (element) {
            condition ? element.classList.add(className) : element.classList.remove(className);
        }
    };

    const loadContent = async (url: string, container: HTMLElement | null, callback?: () => void) => {
        if (container) {
            try {
                const response = await fetch(url);
                container.innerHTML = await response.text();
                if (callback) callback();
            } catch (error) {
                console.error(`Error loading ${url}:`, error);
            }
        }
    };

    const loadDashboard = () => loadContent('dashboardFrm.html', dashboardContainer, () => {
        toggleClass(dashboardContainer, 'hidden', false);
        toggleClass(socioFormContainer, 'hidden', true);
        toggleClass(barcoFormContainer, 'hidden', true);
    });

    const loadSocioForm = () => loadContent('socioForm.html', socioFormContainer, async () => {
        toggleClass(dashboardContainer, 'hidden', true);
        toggleClass(socioFormContainer, 'hidden', false);
        toggleClass(barcoFormContainer, 'hidden', true);
        initializeSocioFormScripts();
        const socios = await listarSocios();
        socios.forEach(agregarSocioATabla);
    });

    const loadBarcoForm = () => loadContent('barcoForm.html', barcoFormContainer, async () => {
        toggleClass(dashboardContainer, 'hidden', true);
        toggleClass(socioFormContainer, 'hidden', true);
        toggleClass(barcoFormContainer, 'hidden', false);
        initializeBarcoFormScripts();
        const barcos = await listarBarcos();
        barcos.forEach(agregarBarcoATabla);
        const socios = await listarSocios();
        const propietarioCedulaSelect = document.getElementById('propietarioCedula') as HTMLSelectElement;
        if (propietarioCedulaSelect) {
            socios.forEach(socio => {
                const option = document.createElement('option');
                option.value = socio.cedula;
                option.text = `${socio.cedula} - ${socio.nombres} ${socio.apellidos}`;
                propietarioCedulaSelect.add(option);
            });
        }
    });

    const initializeSocioFormScripts = () => {
        const searchInput = document.getElementById('searchInputSocio') as HTMLInputElement | null;
        const addSocioForm = document.getElementById('socioForm') as HTMLFormElement | null;

        const $modalElement: HTMLElement | null = document.querySelector('#agregar-modal');
        if ($modalElement) {
            const modalOptions: ModalOptions = {
                placement: 'center',
                closable: true,
                onHide: () => {
                    addSocioForm?.reset();
                }
            };
            modal = new Modal($modalElement, modalOptions);

            document.querySelector('#agregarSocioBtn')?.addEventListener('click', () => {
                modal?.show();
            });
        } else {
            console.error("Modal element not found");
        }

        addSocioForm?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const socio: Socio = {
                cedula: (document.getElementById('cedula') as HTMLInputElement)?.value || '',
                nombres: (document.getElementById('nombres') as HTMLInputElement)?.value || '',
                apellidos: (document.getElementById('apellidos') as HTMLInputElement)?.value || '',
                fechaNacimiento: new Date((document.getElementById('fechaNacimiento') as HTMLInputElement)?.value || ''),
                sexo: (document.getElementById('sexo') as HTMLSelectElement)?.value as "M" | "F" || "M",
                estadoCivil: (document.getElementById('estadoCivil') as HTMLSelectElement)?.value as "soltero" | "casado" | "divorciado" | "viudo" || "soltero",
            };
            await insertarSocio(socio);
            agregarSocioATabla(socio);
            Swal.fire(
                'Guardado!',
                'El socio ha sido guardado con éxito.',
                'success'
            );
            addSocioForm.reset();
            modal?.hide();
        });

        searchInput?.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            document.querySelectorAll('#socioTableBody tr').forEach(row => {
                const found = Array.from(row.querySelectorAll('td, th')).some(cell => cell.textContent?.toLowerCase().includes(searchTerm));
                (row as HTMLElement).style.display = found ? '' : 'none';
            });
        });
    };

    const initializeBarcoFormScripts = () => {
        const searchInput = document.getElementById('searchInputBarco') as HTMLInputElement | null;
        const addBarcoForm = document.getElementById('barcoForm') as HTMLFormElement | null;

        const $modalElement: HTMLElement | null = document.querySelector('#agregar-modalBarco');
        if ($modalElement) {
            const modalOptions: ModalOptions = {
                placement: 'center',
                closable: true,
                onHide: () => {
                    addBarcoForm?.reset();
                }
            };
            modal = new Modal($modalElement, modalOptions);

            document.querySelector('#agregarBarcoBtn')?.addEventListener('click', () => {
                modal?.show();
            });
        } else {
            console.error("Modal element not found");
        }
        addBarcoForm?.addEventListener('submit', async (event) => {
            event.preventDefault();

            const imagenInput = document.getElementById('imagen') as HTMLInputElement;
            const imagenFile = imagenInput.files?.[0] || null;
            let imagenURL = '';

            if (imagenFile) {
                const reader = new FileReader();
                reader.readAsDataURL(imagenFile);
                reader.onload = async () => {
                    imagenURL = reader.result as string;

                    const barco: Barco = {
                        numeroMatricula: (document.getElementById('numeroMatricula') as HTMLInputElement)?.value || '',
                        nombre: (document.getElementById('nombre') as HTMLInputElement)?.value || '',
                        numeroAmarre: parseInt((document.getElementById('numeroAmarre') as HTMLInputElement)?.value || '0', 10),
                        cuota: parseFloat((document.getElementById('cuota') as HTMLInputElement)?.value || '0'),
                        propietarioCedula: (document.getElementById('propietarioCedula') as HTMLSelectElement)?.value || null,
                        imagen: imagenURL
                    };

                    try {
                        await insertarBarco(barco);
                        agregarBarcoATabla(barco);
                        Swal.fire(
                            'Guardado!',
                            'El barco ha sido guardado con éxito.',
                            'success'
                        );
                        addBarcoForm.reset();
                        modal?.hide();
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al guardar el barco',
                        });
                    }
                };
            }
        });

        searchInput?.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            document.querySelectorAll('#barcoTableBody tr').forEach(row => {
                const found = Array.from(row.querySelectorAll('td, th')).some(cell => cell.textContent?.toLowerCase().includes(searchTerm));
                (row as HTMLElement).style.display = found ? '' : 'none';
            });
        });
    };

    const addMenuEventListener = (elementId: string, loadFunction: () => void) => {
        const element = document.getElementById(elementId) as HTMLAnchorElement | null;
        if (element) {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                loadFunction();
                menuItems.forEach(i => i.classList.remove('bg-gradient-to-r', 'from-sky-600', 'to-cyan-400', 'text-white'));
                element.classList.add('bg-gradient-to-r', 'from-sky-600', 'to-cyan-400', 'text-white');
            });
        }
    };

    menuBtn?.addEventListener('click', () => sideNav?.classList.toggle('hidden'));
    addMenuEventListener('inicio', loadDashboard);
    addMenuEventListener('socio', loadSocioForm);
    addMenuEventListener('barco', loadBarcoForm);

    loadDashboard();
});

// Función para agregar un socio a la tabla HTML
function agregarSocioATabla(socio: Socio) {
    const tbody = document.getElementById('socioTableBody');
    if (tbody) {
        const tr = document.createElement('tr');
        tr.classList.add('hover:bg-gray-50');
        tr.innerHTML = `
            <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">${socio.cedula}</th>
            <td class="px-6 py-4">${socio.nombres}</td>
            <td class="px-6 py-4">${socio.apellidos}</td>
            <td class="px-6 py-4">${calcularEdad(new Date(socio.fechaNacimiento))}</td>
            <td class="px-6 py-4">${socio.sexo}</td>
            <td class="px-6 py-4">${socio.estadoCivil}</td>
            <td class="px-6 py-4">
                <div class="flex justify-end gap-4">
                    <button class="eliminar-socio" data-cedula="${socio.cedula}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);

        // Agregar evento al botón de eliminar
        const eliminarBtn = tr.querySelector('.eliminar-socio');
        eliminarBtn?.addEventListener('click', async () => {
            const cedula = eliminarBtn.getAttribute('data-cedula');
            if (cedula) {
                await eliminarSocioHandler(cedula);
            }
        });
    }
}

// Función para agregar un barco a la tabla HTML
function agregarBarcoATabla(barco: Barco) {
    const tbody = document.getElementById('barcoTableBody');
    if (tbody) {
        const tr = document.createElement('tr');
        tr.classList.add('hover:bg-gray-50');
        tr.innerHTML = `
            <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">${barco.numeroMatricula}</th>
            <td class="px-6 py-4">${barco.nombre}</td>
            <td class="px-6 py-4">${barco.numeroAmarre}</td>
            <td class="px-6 py-4">${barco.cuota}</td>
            <td class="px-6 py-4">${barco.propietarioCedula}</td>
            <td class="px-6 py-4"><img src="${barco.imagen}" alt="Imagen del Barco" class="w-10 h-10"></td>
            <td class="px-6 py-4">
                <div class="flex justify-end gap-4">
                    <button class="eliminar-barco" data-numero-matricula="${barco.numeroMatricula}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);

        // Agregar evento al botón de eliminar
        const eliminarBtn = tr.querySelector('.eliminar-barco');
        eliminarBtn?.addEventListener('click', async () => {
            const numeroMatricula = eliminarBtn.getAttribute('data-numero-matricula');
            if (numeroMatricula) {
                await eliminarBarcoHandler(numeroMatricula);
            }
        });
    }
}

// Eliminar barco
async function eliminarBarcoHandler(numeroMatricula: string) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    });

    if (result.isConfirmed) {
        try {
            await eliminarBarco(numeroMatricula);
            const tbody = document.getElementById('barcoTableBody');
            if (tbody) {
                const row = tbody.querySelector(`tr th:first-child`)?.closest('tr');
                row?.remove();
            }
            Swal.fire(
                'Eliminado!',
                'El barco ha sido eliminado.',
                'success'
            );
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al eliminar el barco',
            });
        }
    }
}

// Eliminar socio
async function eliminarSocioHandler(cedula: string) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    });

    if (result.isConfirmed) {
        try {
            await eliminarSocio(cedula);
            const tbody = document.getElementById('socioTableBody');
            if (tbody) {
                const row = tbody.querySelector(`tr th:first-child`)?.closest('tr');
                row?.remove();
            }
            Swal.fire(
                'Eliminado!',
                'El socio ha sido eliminado.',
                'success'
            );
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al eliminar el socio',
            });
        }
    }
}
