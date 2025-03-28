import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
import '../../styles/Solicitudes.css';

export function SolicitudGrado() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    career: '',
    degree: '',
    year: '',
    email: '',
    baucherDocumento: '',
    baucherFiliado: '',
    pagarFiliado: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name: formData.name,
      dni: formData.dni,
      career: formData.career,
      degree: formData.degree,
      year: formData.year,
      email: formData.email,
      baucherDocumento: formData.baucherDocumento,
      baucherFiliado: formData.pagarFiliado ? `Código Baucher Filiado: ${formData.baucherFiliado}` : ''
    };

    emailjs.send('service_72s2ap8', 'template_b8a0cal', templateParams, 'xMTSVIO2p_vZx4J4U')
      .then((response) => {
        console.log('Correo enviado con éxito:', response);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Correo enviado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al enviar el correo',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      });
  };

  const handleBack = () => {
    navigate('/panelprincipal');
  };

  return (
    <div className="solicitud">
      <h2>Solicitud de Grado y Titulo</h2>
      <p>
        Llena este formulario para enviar tu solicitud de grado y título al
        Archivo Central de la Universidad Nacional de San Martín (UNSM).
      </p>
      <p>
        Te contactaremos a tu correo electrónico para confirmar la recepción de tu
        solicitud y dar seguimiento a tu proceso de admisión.
      </p>
      <p>
        También te recomendamos revisar nuestras políticas de aceptación y
        condiciones antes de enviar tu solicitud.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre del interesado:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dni">DNI:</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="career">Carrera:</label>
          <input
            type="text"
            id="career"
            name="career"
            value={formData.career}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="degree">Grado del título:</label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="year">Año:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="baucherDocumento">Código de baucher por derecho de documento:</label>
          <input
            type="text"
            id="baucherDocumento"
            name="baucherDocumento"
            value={formData.baucherDocumento}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="pagarFiliado">
            <input
              type="checkbox"
              id="pagarFiliado"
              name="pagarFiliado"
              checked={formData.pagarFiliado}
              onChange={handleChange}
            />
            Pagar derecho de filiado
          </label>
        </div>
        {formData.pagarFiliado && (
          <div>
            <label htmlFor="baucherFiliado">Código de baucher por derecho de filiado:</label>
            <input
              type="text"
              id="baucherFiliado"
              name="baucherFiliado"
              value={formData.baucherFiliado}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button type="submit">Enviar</button>
        <button type="button" onClick={handleBack}>Regresar</button>
      </form>
    </div>
  );
}
