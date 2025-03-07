import React, { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const CreateAppointment = () => {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    bdate: '',
  });

  const dateInputRef = useRef(null);

  useEffect(() => {
    if (dateInputRef.current) {
      flatpickr(dateInputRef.current, {
        enableTime: true,
        dateFormat: 'Y-m-d',
        minDate: 'today',
        disable: [
          function (date) {
            return date.getDay() === 0 || date.getDay() === 6; 
          },
        ],
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const localDateTime = selectedDates[0]
              .toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' }) 
            setData('bdate', localDateTime);
          }
        },
      });
    }
  }, [setData]);

  // Handle Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  // Handle form submit
const handleSubmit = (e) => {
  e.preventDefault();

  post(route('appointments.store'), {
    onSuccess: () => {
      setData({
        title: '',
        description: '',
        bdate: '',
      });
      toast.success('Appointment Booked Successfully');
    },
    onError: (errors) => {
      if (errors) {
        Object.values(errors).forEach((error) => {
          toast.error(error[0]); // Pehle error message ko toast se show karega
        });
      } else {
        toast.error('An error occurred. Please try again.');
      }
    },
  });
};


  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="max-w-4xl mx-auto p-6 mt-10 mb-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Appointment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
          </div>

          <div>
            <label htmlFor="bdate" className="block text-lg font-medium text-gray-700">Date & Time</label>
            <input
              type="text"
              id="bdate"
              name="bdate"
              ref={dateInputRef}
              value={data.bdate}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.bdate && <span className="text-red-500 text-sm">{errors.bdate}</span>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {processing ? 'Submitting...' : 'Create Appointment'}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </AuthenticatedLayout>
  );
};

export default CreateAppointment;
