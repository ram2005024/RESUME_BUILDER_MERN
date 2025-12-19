import React from "react";
import { Stars } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center mb-78" id="cte">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
      <section className="flex flex-col items-center justify-center mx-auto max-md:mx-2 max-md:px-2 max-w-5xl w-full text-center rounded-2xl py-16 bg-slate-100/70">
        <Stars size={40} color="green" />
        <h1 className="text-2xl md:text-3xl font-medium text-slate-900 max-w-2xl mt-5">
          Build beautiful resumes with cyrusTech.
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mt-2">
          Cyrus gives you beautifully designed, ready-to-use resume sections—so
          you can build standout resumes fast, without starting from scratch.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-2.5 mt-4 text-sm rounded-lg bg-green-600 hover:scale-105 transition duration-300 text-white"
          >
            Get Started
          </button>
          <button className="flex items-center gap-2 px-8 py-2.5 mt-4 text-sm hover:scale-105 transition duration-300">
            <a href="https://github.com/ram2005024">Github</a>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#a)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7 0C3.133 0 0 3.133 0 7a7 7 0 0 0 4.786 6.641c.35.062.482-.149.482-.332 0-.166-.01-.718-.01-1.304-1.758.324-2.213-.429-2.353-.823-.079-.2-.42-.822-.717-.988-.246-.132-.596-.455-.01-.464.552-.009.946.508 1.077.717.63 1.06 1.636.762 2.039.578.061-.455.245-.761.446-.936-1.557-.175-3.185-.779-3.185-3.456 0-.762.271-1.392.717-1.882-.07-.175-.314-.892.07-1.855 0 0 .587-.183 1.926.718a6.5 6.5 0 0 1 1.75-.236c.595 0 1.19.078 1.75.236 1.338-.91 1.925-.718 1.925-.718.385.963.14 1.68.07 1.855a2.7 2.7 0 0 1 .717 1.882c0 2.686-1.636 3.28-3.194 3.456.254.218.473.638.473 1.295 0 .936-.009 1.688-.009 1.925 0 .184.131.402.481.332A7.01 7.01 0 0 0 14 7c0-3.867-3.133-7-7-7"
                  fill="#364153"
                />
              </g>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;
