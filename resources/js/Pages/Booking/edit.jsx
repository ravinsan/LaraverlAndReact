import React, { useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const Edit = ({ appointment }) => {
  const { data, setData, put, processing, errors } = useForm({
    title: appointment.title,
    description: appointment.description,
    bdate: appointment.bdate,
  });

  const dateInputRef = useRef(null);

  useEffect(() => {
    if (dateInputRef.current) {
      flatpickr(dateInputRef.current, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        disable: [
          function (date) {
            return date.getDay() === 0 || date.getDay() === 6; 
          },
        ],
        defaultDate: appointment.bdate || new Date(), 
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const localDateTime = selectedDates[0]
              .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }) 
            setData("bdate", localDateTime);
          }
        },
      });
    }
  }, [setData, appointment.bdate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("appointments.update", appointment.id), {
      onSuccess: () => {
        toast.success("Appointment Updated Successfully");
      },
      onError: () => {
        toast.error("An error occurred. Please try again.");
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-3xl mx-auto p-6 mt-10 mb-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Appointment</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              className="w-full border rounded p-2"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Date & Time</label>
            <input
              type="text"
              ref={dateInputRef}
              className="w-full border rounded p-2"
              value={data.bdate}
              onChange={(e) => setData("bdate", e.target.value)}
            />
            {errors.bdate && <p className="text-red-500 text-sm">{errors.bdate}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={processing}
            >
              {processing ? "Updating..." : "Update Appointment"}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default Edit;
