document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const selectButton = document.getElementById("selectButton");
  const originalImage = document.getElementById("originalImage");
  const processedImage = document.getElementById("processedImage");
  const removeBackgroundBtn = document.getElementById("removeBackground");
  const downloadBtn = document.getElementById("download");
  const loading = document.querySelector(".loading");

  loading.style.display = "none";

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  });

  selectButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  });

  let uploadedFile = null;

  function handleImageUpload(file) {
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      originalImage.src = e.target.result;
      originalImage.hidden = false;
      processedImage.hidden = true;
      removeBackgroundBtn.disabled = false;
      downloadBtn.disabled = true;
    };
    reader.readAsDataURL(file);
  }

  removeBackgroundBtn.addEventListener("click", async () => {
    if (!uploadedFile) return;

    loading.style.display = "flex";
    try {
      const formdata = new FormData();
      formdata.append("file", uploadedFile);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formdata,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      processedImage.src = url;
      processedImage.hidden = false;
      downloadBtn.disabled = false;
    } catch (error) {
      console.error("Background removal failed:", error);
    } finally {
      loading.style.display = "none";
    }
  });

  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = processedImage.src;
    link.download = "processed_image.png";
    link.click();
  });
});
