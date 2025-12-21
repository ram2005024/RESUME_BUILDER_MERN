export const generateOTP = () => {
  const randomOTP = Math.floor(Math.random() * 90000 + 10000);
  return randomOTP;
};
