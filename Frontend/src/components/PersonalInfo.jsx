import axios from "axios";
import {
  BriefcaseBusiness,
  Globe,
  LinkIcon,
  LocateIcon,
  MailIcon,
  PhoneCall,
  User,
  User2Icon,
} from "lucide-react";

import { useState } from "react";
import { toast } from "react-toastify";

const PersonalInfo = ({
  data,
  setRemoveBackground,
  removeBackground,
  onChange,
  setResume,
  resume,
  handleSave,
  setIsDirty,
}) => {
  const [disable, setDisable] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBGRemove, setLoadingBGRemove] = useState(false);

  // IMPORTANT:
  // data is your personal_info object
  const image = data?.image;

  const isBGRemoved = data?.removeBackground === true;

  // =========================================================
  // UPLOAD IMAGE
  // =========================================================
  const handleUploadImage = async (fileToUpload) => {
    if (!fileToUpload) return;

    try {
      setLoading(true);

      // Keep original File object in state.
      // We need this later when removing background.
      setFile(fileToUpload);

      const formData = new FormData();

      formData.append("image", fileToUpload);
      formData.append("removeBG", "false");
      formData.append("resumeID", resume.id);

      const res = await axios.post(
        import.meta.env.VITE_API_URL + "resume/uploadImage",
        formData,
        {
          withCredentials: true,
        },
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Image uploaded successfully");

      // Update resume state
      setResume((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          image: res.data.imageURL,
          removeBackground: false,
        },
      }));

      // Update remove background state
      setRemoveBackground(false);
    } catch (error) {
      console.error("Upload image error:", error);

      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
      setIsDirty(true);
    }
  };

  // =========================================================
  // REMOVE BACKGROUND
  // =========================================================
  const handleRemoveBackground = async () => {
    // We need the original File
    if (!file) {
      toast.error(
        "Original image is not available. Please upload the image again.",
      );
      return;
    }

    try {
      setLoadingBGRemove(true);
      setDisable(true);

      const formData = new FormData();

      formData.append("image", file);
      formData.append("removeBG", "true");
      formData.append("resumeID", resume.id);

      console.log("==========================================");
      console.log("Removing background...");
      console.log("File:", file);
      console.log("File name:", file.name);
      console.log("File type:", file.type);
      console.log("File size:", file.size);
      console.log("Remove BG:", "true");
      console.log("==========================================");

      const res = await axios.post(
        import.meta.env.VITE_API_URL + "resume/uploadImage",
        formData,
        {
          withCredentials: true,
        },
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Background removed successfully");

      // Update switch state
      setRemoveBackground(true);

      // Update resume
      setResume((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          image: res.data.imageURL,
          removeBackground: true,
        },
      }));
    } catch (error) {
      console.error("Remove background error:", error);

      toast.error(
        error.response?.data?.message ||
          "Error occurred while removing background",
      );
    } finally {
      setLoadingBGRemove(false);
      setDisable(false);
      setIsDirty(true);
    }
  };

  // =========================================================
  // FORM FIELDS
  // =========================================================
  const formFields = [
    {
      label: "Full name",
      key: "name",
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
      label: "Location",
      key: "location",
      logo: LocateIcon,
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

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================
  const handleChange = (key, value) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  // =========================================================
  // UI
  // =========================================================
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="flex flex-col space-y-5"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold">Personal Information</h1>

        <p className="text-slate-500">Get started with personal information</p>
      </div>

      {/* =====================================================
          IMAGE SECTION
      ====================================================== */}
      <div className="flex items-center gap-4">
        {/* IMAGE */}
        {image ? (
          <div className="flex items-center gap-3">
            <img
              src={image}
              className="w-16 h-16 rounded-full object-cover"
              alt="user_image"
            />
          </div>
        ) : loading ? (
          /* LOADING IMAGE */
          <div className="flex items-center gap-3">
            <span>Loading image...</span>

            <div
              className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent text-gray-500"
              aria-label="Loading"
              role="status"
            />
          </div>
        ) : (
          /* UPLOAD */
          <div className="flex items-center gap-2">
            <User2Icon
              className="
                size-10
                rounded-full
                hover:opacity-80
                stroke-1
                p-1
                bg-gray-100
              "
            />

            <label className="text-slate-600 hover:text-slate-400 cursor-pointer">
              Upload user image
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];

                  if (selectedFile) {
                    handleUploadImage(selectedFile);
                  }
                }}
              />
            </label>
          </div>
        )}

        {/* =====================================================
            REMOVE BACKGROUND
        ====================================================== */}

        {loadingBGRemove ? (
          /* LOADING */
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border-2
                  border-transparent
                  border-t-blue-500
                  border-r-purple-500
                  animate-spin
                "
              />
            </div>

            <p className="text-sm font-medium text-gray-700">
              Removing background...
            </p>
          </div>
        ) : image && !isBGRemoved ? (
          /* REMOVE BACKGROUND SWITCH */
          <div className="flex flex-col gap-2 justify-center">
            <span>Remove background</span>

            <label className="inline-flex gap-2">
              <input
                type="checkbox"
                hidden
                disabled={disable}
                className="peer sr-only"
                checked={removeBackground}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleRemoveBackground();
                  }
                }}
              />

              <div
                className="
                  w-12
                  h-7
                  cursor-pointer
                  bg-slate-400
                  rounded-full
                  peer-checked:bg-green-600
                  relative
                  transition-colors
                  duration-200
                "
              >
                <span
                  className={`
                    w-5
                    h-5
                    absolute
                    top-1
                    left-1
                    rounded-full
                    bg-slate-300
                    transform
                    transition-transform
                    duration-300
                    ${removeBackground ? "translate-x-5" : "translate-x-0"}
                  `}
                />
              </div>
            </label>
          </div>
        ) : null}
      </div>

      {/* =====================================================
          FORM FIELDS
      ====================================================== */}

      {formFields.map((item) => {
        const Logo = item.logo;

        return (
          <div key={item.key} className="flex flex-col space-y-1 w-full">
            <div className="flex items-center gap-3">
              <Logo className="size-4 text-slate-600" />

              <label className="font-semibold text-slate-700">
                {item.label}
              </label>

              {item.required && (
                <span className="rotate-90 text-red-600">*</span>
              )}
            </div>

            <div>
              <input
                type={item.type}
                required={item.required}
                className="
                  p-2
                  px-4
                  border
                  border-slate-400
                  rounded-lg
                  w-full
                  focus:border-slate-900
                  focus:outline-1
                  focus:outline-slate-600
                  focus:ring-1
                  focus:ring-indigo-300
                "
                value={data[item.key] || ""}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder={`Enter your ${item.label.toLowerCase()}`}
              />
            </div>
          </div>
        );
      })}

      {/* =====================================================
          SAVE BUTTON
      ====================================================== */}

      <button
        type="submit"
        className="
          self-start
          ml-2
          px-6
          py-2
          bg-emerald-600
          hover:bg-emerald-700
          text-white
          font-medium
          rounded-lg
          transition-colors
          duration-200
          shadow-sm
          active:scale-95
        "
      >
        Save
      </button>
    </form>
  );
};

export default PersonalInfo;
