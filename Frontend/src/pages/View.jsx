import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import Preview from "../components/Preview";
import LoaderComponent from "../components/Loader";
import { FileSearch, Home } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const View = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const loadResume = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + `resume/get/${resumeId}`
      );
      if (res.data.success) setResume(res.data.resume);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    loadResume();
  }, []);
  if (isLoading) return <LoaderComponent />;
  return (
    <>
      {resume ? (
        <div className="bg-slate-100   flex justify-center">
          <div className="max-w-3xl w-full sm:mt-4 sm:mb-4 m-3">
            <Preview
              data={resume}
              accent={resume.accent_color}
              template={resume.template}
            />
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-50 text-slate-900">
          <div className="mb-4 p-4 bg-slate-100 rounded-full">
            <FileSearch size={48} className="text-slate-400" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">No resume found</h1>
          <p className="text-slate-500 mb-6">
            We couldn't find the file you're looking for.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
          >
            <Home size={18} />
            <span>Go back home</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default View;
