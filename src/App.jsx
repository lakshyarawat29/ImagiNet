import React, { useState } from "react";
import axios from "axios";
import bgImage from '../src/assets/bgimg.jpg'

const App = () => {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [contentPreview, setContentPreview] = useState(null);
  const [stylePreview, setStylePreview] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContentUpload = (e) => {
    const file = e.target.files[0];
    setContentImage(file);
    setContentPreview(URL.createObjectURL(file));
  };

  const handleStyleUpload = (e) => {
    const file = e.target.files[0];
    setStyleImage(file);
    setStylePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!contentImage || !styleImage) {
      alert("Please upload both content and style images.");
      return;
    }

    const formData = new FormData();
    formData.append("content_image", contentImage);
    formData.append("style_image", styleImage);

    setLoading(true);
    try {
      const response = await axios.post(
        "https://<your-fastapi-endpoint>/style-transfer",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const imageUrl = URL.createObjectURL(blob);
      setOutputImage(imageUrl);
    } catch (err) {
      alert("Something went wrong during style transfer.");
      console.error(err);
    }
    setLoading(false);
  };

  const predefinedStyles = [
    {
      name: "Starry Night",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    },
    {
      name: "The Scream",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/800px-The_Scream.jpg",
    },
    {
      name: "Monet - Water Lilies",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/800px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg",
    },
  ];

  const handlePredefinedStyle = (style) => {
    fetch(style.url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${style.name}.jpg`, { type: blob.type });
        setStyleImage(file);
        setStylePreview(style.url);
      });
  };

  return (
    <div
      className="min-h-screen p-6 flex flex-col justify-between"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hero */}
      <header className="text-center mb-12 bg-white bg-opacity-60 p-4 rounded-xl">
        <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md">
          ImagiNet 🎨
        </h1>
        <p className="text-lg mt-3 text-gray-700 max-w-xl mx-auto">
          Bring your images to life with <span className="font-semibold">AI-powered style transfer</span> — upload a photo, pick a painting style, and let ImagiNet transform your vision into art.
        </p>
      </header>

      {/* Upload Cards */}
      <div className="flex flex-wrap justify-center gap-8 mb-10">
        <div className="bg-white p-5 rounded-2xl shadow-lg w-72 text-center hover:shadow-xl transition">
          <h2 className="font-semibold text-lg mb-2 text-indigo-600">Content Image</h2>
          <input type="file" accept="image/*" onChange={handleContentUpload} />
          {contentPreview && (
            <img
              src={contentPreview}
              alt="Content"
              className="mt-4 rounded-lg shadow-md"
            />
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-lg w-72 text-center hover:shadow-xl transition">
          <h2 className="font-semibold text-lg mb-2 text-pink-600">Style Image</h2>
          <input type="file" accept="image/*" onChange={handleStyleUpload} />
          {stylePreview && (
            <img
              src={stylePreview}
              alt="Style"
              className="mt-4 rounded-lg shadow-md"
            />
          )}
        </div>
      </div>

      {/* Predefined Styles */}
      <div className="max-w-5xl mx-auto mb-10 bg-white bg-opacity-60 p-4 rounded-xl">
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">Or choose a predefined style</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {predefinedStyles.map((style) => (
            <div
              key={style.name}
              onClick={() => handlePredefinedStyle(style)}
              className="cursor-pointer w-40 hover:scale-105 transform transition duration-300"
            >
              <img
                src={style.url}
                alt={style.name}
                className="rounded-lg shadow-md border"
              />
              <p className="text-center mt-2 text-sm font-medium text-gray-600">{style.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 text-white text-lg font-medium rounded-full hover:bg-indigo-700 transition-all shadow-lg"
        >
          {loading ? "Transferring Style..." : "Create Stylized Art"}
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="text-center mt-4 text-gray-800 font-medium animate-pulse">
          Applying artistic magic... ✨
        </div>
      )}

      {/* Output */}
      {outputImage && (
        <div className="mt-12 max-w-2xl mx-auto text-center bg-white bg-opacity-70 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🌟 Stylized Result</h2>
          <img
            src={outputImage}
            alt="Stylized Output"
            className="w-full rounded-xl shadow-xl border"
          />
          <a
            href={outputImage}
            download="stylized_result.jpg"
            className="inline-block mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition"
          >
            Download Image
          </a>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 py-6 text-center text-sm text-gray-200 bg-black bg-opacity-50 rounded-lg">
        © 2025 ImagiNet — Made with ❤️ using FastAPI, PyTorch, and React.
        <br />
        <a
          href="https://github.com/developerclubiitj/imaginet"
          className="text-indigo-300 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Source on GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;
