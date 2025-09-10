import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ModulePage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const title = params.moduleId
    ? params.moduleId.charAt(0).toUpperCase() + params.moduleId.slice(1)
    : "Module";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 bg-white rounded shadow"
        >
          Back
        </button>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-gray-600 mt-2">This is the {title} page.</p>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
