import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { specialty } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);

  const { doctors } = useContext(AppContext);

  const handleSpecialtyClick = (selectedSpecialty) => {
    if (specialty === selectedSpecialty) {
      navigate("/doctors");
    } else {
      navigate(`/doctors/${selectedSpecialty}`);
    }
  };

  useEffect(() => {
    if (specialty) {
      setFilterDoc(doctors.filter((doc) => doc.specialty === specialty));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, specialty]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {[
            "General Physician",
            "Gynecologist",
            "Dermatologist",
            "Pediatrician",
            "Neurologist",
            "Gastroenterologist",
          ].map((spec) => (
            <p
              key={spec}
              onClick={() => handleSpecialtyClick(spec)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                specialty === spec ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className="w-full grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;