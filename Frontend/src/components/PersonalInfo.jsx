import {
  BriefcaseBusiness,
  Globe,
  LinkIcon,
  MailIcon,
  PhoneCall,
  User,
  User2Icon,
  UserCircle,
} from "lucide-react";
import React from "react";

const PersonalInfo = ({
  data,
  setRemoveBackground,
  removeBackground,
  onChange,
}) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  const formFields = [
    {
      label: "Full name",
      key: "full_name",
      required: true,
      logo: User,
      type: "text",
    },
    {
      label: "Email address",
      key: "email",
      required: true,
      logo: MailIcon,
      type: "text",
    },
    {
      label: "Phone number",
      key: "phone",
      logo: PhoneCall,
      type: "text",
    },
    {
      label: "Profession",
      key: "profession",
      logo: BriefcaseBusiness,
      type: "text",
    },
    {
      label: "Linked In url",
      key: "linkedin",
      logo: LinkIcon,
      type: "text",
    },
    {
      label: "Website",
      key: "website",
      logo: Globe,
      type: "text",
    },
  ];
  return (
    <div className="flex flex-col space-y-5 ">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold ">Personal Information</h1>
        <p className="text-slate-500">Get started with personal information</p>
      </div>
      <div className="flex items-center  gap-2">
        {data.image ? (
          <div>
            <img
              src={
                typeof data.image === "string"
                  ? data.image
                  : URL.createObjectURL(data.image)
              }
              className="w-16 h-16 rounded-full"
              alt="user_image"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <User2Icon className="size-10 rounded-full  hover:opacity-80 stroke-1 p-1 bg-gray-100 ring-0" />
            <label>
              <p className="text-slate-600 hover:text-slate-400">
                Upload user image
              </p>
              <input
                type="file"
                accept="image/jpeg image/png"
                className="hidden"
                onChange={(e) => handleChange("image", e.target.files[0])}
              />
            </label>
          </div>
        )}
        {(typeof data.image === "object" || typeof data.image === "string") && (
          <div className="flex flex-col gap-2  justify-center">
            <span>Remove background</span>
            <label className="inline-flex  gap-2 ">
              <input
                type="checkbox"
                hidden
                className="peer sr-only"
                onChange={() => setRemoveBackground(!removeBackground)}
                checked={removeBackground}
              />
              <div className="w-12 h-7 cursor-pointer bg-slate-400 rounded-full peer-checked:bg-green-600 relative peer-checked:ring-pink-300 transition-colors duration-200">
                <span
                  className={`dot w-5 h-5 absolute top-1 left-1 rounded-full bg-slate-300 transform transition-transform duration-300 ease-in-out  ${
                    removeBackground ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </div>
            </label>
          </div>
        )}
      </div>
      {formFields.map((items) => {
        const Logo = items.logo;
        const type = items.type;
        const key = items.key;
        const label = items.label;
        return (
          <div key={items.key} className="flex flex-col space-y-1 w-full">
            <div className="flex items-center gap-3">
              <Logo className="size-4  text-slate-600" />
              <label className="font-semibold text-slate-700 ">{label}</label>
              {items.required && (
                <span className="rotate-90 text-red-600">*</span>
              )}
            </div>
            <div>
              <input
                type={type}
                required={items.required}
                className="p-2 px-4 border border-slate-400 rounded-lg w-full focus:border-slate-900  focus:outline-1 focus:outline-slate-600 focus:ring-1 focus:ring-indigo-300"
                value={data[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfo;
