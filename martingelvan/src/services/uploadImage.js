export const uploadToImgbb = async (file) => {
  const apiKey = "0d6339c6b8b2d3f51eece35979c71f78"; // reemplazá con tu clave real

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    return data.data.url; // URL directa de la imagen
  } else {
    throw new Error("Error subiendo la imagen a ImgBB");
  }
};
