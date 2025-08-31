export interface FormErrors {
  [key: string]: string;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

export const handleApiError = (error: any): FormErrors => {
  const newErrors: FormErrors = {};

  if (error.response?.data) {
    const errorData: ApiErrorResponse = error.response.data;
    
    // Laravel validation errors
    if (errorData.errors) {
      Object.keys(errorData.errors).forEach((field) => {
        newErrors[field] = errorData.errors![field][0]; // İlk hata mesajını al
      });
    }
    
    // Genel hata mesajı
    if (errorData.message) {
      newErrors.general = errorData.message;
    }
  } else if (error.message) {
    newErrors.general = error.message;
  } else {
    newErrors.general = "Bir hata oluştu. Lütfen tekrar deneyiniz.";
  }

  return newErrors;
};

export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return "Bir hata oluştu. Lütfen tekrar deneyiniz.";
};
