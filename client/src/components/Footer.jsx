import { assets } from "../assets/assets2";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        {/* ----- Left section ----- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            MediLink is your trusted partner in healthcare, making it easier
            than ever to find and book appointments with qualified doctors.
            Whether you're looking for a specialist or general practitioner,
            MediLink helps you connect with the right healthcare professional at
            the right time. Manage appointments, view doctor profiles, and take
            control of your health journey — all in one simple, secure platform.
          </p>
        </div>

        {/* ----- Center section ----- */}
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* ----- Right section ----- */}
        <div>
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-234-456-789</li>
            <li>medilink@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* ------ Copyright Text ----- */}
      <div>
        <hr className="border-gray-300" />
        <p className="py-5 text-sm text-center">
          Copyright 2024@ MediLink - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
