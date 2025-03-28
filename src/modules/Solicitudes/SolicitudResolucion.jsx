import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
import '../../styles/Solicitudes.css';

export function SolicitudResolucion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resolutionNumber: '',
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
      resolutionNumber: formData.resolutionNumber,
      year: formData.year,
      email: formData.email,
      baucherDocumento: formData.baucherDocumento,
      baucherFiliado: formData.pagarFiliado ? `Código Baucher Filiado: ${formData.baucherFiliado}` : ''
    };

    emailjs.send('service_72s2ap8', 'template_8qmrghk', templateParams, 'xMTSVIO2p_vZx4J4U')
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
      <h2>Solicitud de Resolución</h2>
      <p>
        Llena este formulario para enviar tu solicitud de resolución al
        Archivo Central de la Universidad Nacional de San Martín (UNSM).
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="resolutionNumber">Número de Resolución:</label>
          <input
            type="text"
            id="resolutionNumber"
            name="resolutionNumber"
            value={formData.resolutionNumber}
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
