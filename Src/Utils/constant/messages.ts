const generateMessage = (entity :string) => ({
    alreadyExist: `${entity} Already Exist `,
    notFound: `${entity} Not Found`,
    failToCreate: `Fail To Create ${entity}`,
    failToUpdate: `Fail To Update ${entity}`,
    failToDelete: `Fail To Delete ${entity}`,
    createdSuccessfully: `${entity} Created Successfully`,
    updateSuccessfully: `${entity} Updated Successfully`,
    deleteSuccessfully: `${entity} Deleted Successfully`,
    notAllowed: `${entity} Not Authorized To Access This Api`,
    verifiedSuccessfully: `${entity} Verified Successfully`,
  });
  export const messages = {

    user: {
      ...generateMessage("User"),
      verified: "User Verified Successfully",
      notAuthorized: "not authorized to access this api",
      invalidCredential: "Something Wrong In Password",
      changePassword: "Password Changed Successfully",
      AlreadyHasOtp: "You Already Has OTP",
      checkEmail:"Check Your email",
      invalidOTP:"Invalid OTP", 
      expireOTP :"OTP IS EXPIRE ",
      login:"Congratulation Please Login",
      loginSuccessfully:"User Login Successfully",
      Incorrect:"Incorrect In Email Or Password",
      AlreadyVerified:"You Already Verified"
    },
   
  };