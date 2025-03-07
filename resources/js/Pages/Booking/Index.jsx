import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export const Index = ({ records }) => {
  const { delete: destroy, get, post } = useForm();
  const [filters, setFilters] = useState({
    title: new URLSearchParams(window.location.search).get("title") || "",
    bdate: new URLSearchParams(window.location.search).get("bdate") || "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    get(route("appointments.index", filters));
  };

  const clearFilters = () => {
    setFilters({ title: "", bdate: "" });
    get(route("appointments.index")); 
  };

const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      destroy(route("appointments.destroy", id), {
        onSuccess: () => {
          toast.success("Appointment deleted successfully");
          Swal.fire("Deleted!", "Your appointment has been deleted.", "success");
        },
        onError: () => toast.error("Failed to delete appointment. Try again."),
      });
    }
  });
};



const handleCancel = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to cancel this appointment!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, cancel it!",
  }).then((result) => {
    if (result.isConfirmed) {
      post(route("appointments.cancel", id), {
        onSuccess: () => {
          toast.success("Appointment cancelled successfully");
          get(route("appointments.index"));
        },
        onError: () => toast.error("Failed to cancel appointment. Try again."),
      });
    }
  });
};

  
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="max-w-4xl mx-auto p-6 mt-10 mb-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Appointments
        </h1>

        {/* Filters */}
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Search by title"
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            name="bdate"
            value={filters.bdate}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <button
            onClick={applyFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>

        <Link
          href={route("appointments.create")}
          className="bg-green-500 text-white py-2 px-4 rounded mb-4 inline-block"
        >
          Add
        </Link>

        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Date & Time</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.data && records.data.length > 0 ? (
              records.data.map((record) => (
                <tr key={record.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{record.title}</td>
                  <td className="px-4 py-2 border">{record.description}</td>
                  <td className="px-4 py-2 border">
                    {new Date(record.bdate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {record.status === 1 ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded">
                        Booked
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-3 py-1 rounded">
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border space-x-2">
                    <Link
                      href={route("appointments.edit", record.id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleCancel(record.id)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 flex justify-center space-x-2">
          {records.links.map((link, index) => (
            <Link
              key={index}
              href={link.url || "#"}
              className={`px-4 py-2 border rounded ${
                link.active
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            ></Link>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
