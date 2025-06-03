import { assets } from "../../assets/assets";

const AddDoctor = () => {
  return (
    <form className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border border-gray-300 rounded w-full max-w-4xl max-h-[90vh] overflow-y-scroll">
        {/* Upload image */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-200 rounded-full cursor-pointer"
              src={assets.upload_area}
              alt=""
            />
          </label>
          <input type="file" id="doc-img" hidden />
          <p>
            Upload doctor <br /> image
          </p>
        </div>

        {/* Form content layout */}
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                type="text"
                placeholder="Name"
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                type="email"
                placeholder="Email"
                required
                className="border border-gray-300 rounded px-3 py-2 bg-[#f2f3ff]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                type="password"
                placeholder="Password"
                required
                className="border border-gray-300 rounded px-3 py-2 bg-[#f2f3ff]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select className="border border-gray-300 rounded px-3 py-2">
                <option value="1">1 Year</option>
                <option value="2">2 Year</option>
                <option value="3">3 Year</option>
                <option value="4">4 Year</option>
                <option value="5">5 Year</option>
                <option value="6">6 Year</option>
                <option value="7">7 Year</option>
                <option value="8">8 Year</option>
                <option value="9">9 Year</option>
                <option value="10+">10+ Year</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                type="number"
                placeholder="Fees"
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Specialty</p>
              <select className="border border-gray-300 rounded px-3 py-2">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Education</p>
              <input
                type="text"
                placeholder="Education"
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                type="text"
                placeholder="Address 1"
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Address 2"
                required
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            placeholder="Write about doctor"
            rows={5}
            required
            className="w-full px-4 pt-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-[#36A3CA] px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;