import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import Navbar from "../../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

export default function PaginaPrincipal() {
  const handleNavigation = (href, message) => {
    localStorage.setItem("navMessage", message);
    navigate(href);
    if (href === "/resoluciones") {
      window.location.reload();
    }
  };
  const handleResolucion = () => {
    localStorage.setItem("message", "verresolucion/");
  };

  return (
    <div>
      <Navbar />
      <div className="relative isolate overflow-hidden bg-white px-6 py-10 sm:py-12 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-indigo-600">
                  Archivo Central UNSM
                </p>
                <div className="grid grid-cols-2">
                  <Link to="/grados">
                    <p className="text-base font-semibold leading-7 text-indigo-600">
                      Grados y Titulos
                    </p>
                  </Link>
                  <Link to="/posgrados">
                    <p className="text-base font-semibold leading-7 text-indigo-600">
                      Maestrias y Doctorados
                    </p>
                  </Link>
                  <Link
                    className="text-base font-semibold leading-7 text-indigo-600"
                    to="/resoluciones"
                    onClick={handleResolucion}
                  >
                    <p>Resoluciones</p>
                  </Link>
                </div>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Gestión Documental Eficiente
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                  El Archivo Central de la Universidad Nacional de San Martín
                  asegura la conservación y organización adecuada de todos los
                  documentos académicos y administrativos. Nuestro objetivo es
                  proporcionar acceso rápido y eficiente a la información,
                  facilitando la toma de decisiones y la transparencia
                  institucional.
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="https://unsm.edu.pe/wp-content/uploads/2022/03/escudologotipo_unsm_2021_lateral_principal_siglas_PNG-370x142.png"
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <p>
                  Nuestro archivo cuenta con tecnología de punta para el manejo
                  de documentos, garantizando la integridad y seguridad de la
                  información. Desde la recepción hasta la disposición final,
                  cada documento sigue un proceso riguroso que asegura su
                  correcta gestión y conservación.
                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    <CloudArrowUpIcon
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    />
                    <span>
                      <strong className="font-semibold text-gray-900">
                        Acceso rápido y seguro.
                      </strong>{" "}
                      Todos los documentos están digitalizados y se pueden
                      acceder de manera segura y rápida, facilitando las
                      consultas y mejorando la eficiencia administrativa.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <LockClosedIcon
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    />
                    <span>
                      <strong className="font-semibold text-gray-900">
                        Seguridad de la información.
                      </strong>{" "}
                      Contamos con sistemas de seguridad avanzados para proteger
                      la integridad y confidencialidad de los documentos
                      almacenados.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <ServerIcon
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    />
                    <span>
                      <strong className="font-semibold text-gray-900">
                        Copias de seguridad.
                      </strong>{" "}
                      Realizamos copias de seguridad periódicas para asegurar
                      que la información esté siempre disponible y protegida
                      contra pérdidas o daños.
                    </span>
                  </li>
                </ul>
                <p className="mt-8">
                  Además, ofrecemos servicios de asesoramiento en gestión
                  documental para optimizar el uso y manejo de los archivos
                  dentro de la universidad. Nuestro equipo está siempre
                  dispuesto a ayudar y brindar soporte a todas las unidades
                  académicas y administrativas.
                </p>
                <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                  Sin servidor? Sin problema.
                </h2>
                <p className="mt-6">
                  Nuestra plataforma permite la gestión documental sin necesidad
                  de infraestructura propia. Ofrecemos soluciones en la nube que
                  facilitan el acceso y manejo de los documentos desde cualquier
                  lugar y en cualquier momento, asegurando la continuidad
                  operativa y la eficiencia en la gestión de la información.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
