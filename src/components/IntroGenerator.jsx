import { useState } from "react";
import Background from "./Background";

const IntroGenerator = () => {
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    series: "",
    college: "",
    school: "",
    hometown: "",
  });
  const [vaiyaIntro, setVaiyaIntro] = useState("");
  const [apuIntro, setApuIntro] = useState("");
  const [vaiyaCopied, setVaiyaCopied] = useState(false);
  const [apuCopied, setApuCopied] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateIntro = () => {
    const { name, roll, series, college, school, hometown } = formData;
    const vaiyaText = `আসসালামু আলাইকুম ভাই,\n\nআমি ${name}\nডিপার্টমেন্ট অফ ইলেক্ট্রিক্যাল এন্ড কম্পিউটার ইঞ্জিনিয়ারিং, ${series} সিরিজ\nরাজশাহী ইউনিভার্সিটি অফ ইঞ্জিনিয়ারিং অ্যান্ড টেকনোলজি, রাজশাহী\n\nরোল: ${roll}\n\nকলেজ: ${college}\n\nস্কুল: ${school}\n\nহোমটাউন: ${hometown}\n\nভাই, আমি কি আপনার সাথে পরিচিত হতে পারি?`;
    const apuText = `আসসালামু আলাইকুম আপু,\n\nআমি ${name}\nডিপার্টমেন্ট অফ ইলেক্ট্রিক্যাল এন্ড কম্পিউটার ইঞ্জিনিয়ারিং, ${series} সিরিজ\nরাজশাহী ইউনিভার্সিটি অফ ইঞ্জিনিয়ারিং অ্যান্ড টেকনোলজি, রাজশাহী\n\nরোল: ${roll}\n\nকলেজ: ${college}\n\nস্কুল: ${school}\n\nহোমটাউন: ${hometown}\n\nআপু, আমি কি আপনার সাথে পরিচিত হতে পারি?`;
    setVaiyaIntro(vaiyaText);
    setApuIntro(apuText);
  };

  const copyVaiyaToClipboard = () => {
    navigator.clipboard.writeText(vaiyaIntro);
    setVaiyaCopied(true);
    setTimeout(() => setVaiyaCopied(false), 2000); // Reset after 2 seconds
  };

  const copyApuToClipboard = () => {
    navigator.clipboard.writeText(apuIntro);
    setApuCopied(true);
    setTimeout(() => setApuCopied(false), 2000); // Reset after 2 seconds
  };

  // Check if all fields are filled
  const isFormValid = Object.values(formData).every(
    value => value.trim() !== ""
  );

  return (
    <>
      <Background />
      <div className="relative min-h-screen">
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-neon-glow text-center mb-8">
            ইন্ট্রো জেনারেটর
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 font-medium text-center mb-8 max-w-2xl mx-auto">
            বাংলায় পূরণ করুন
          </p>

          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  নাম *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="আপনার নাম"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  রোল নম্বর *
                </label>
                <input
                  type="text"
                  name="roll"
                  value={formData.roll}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="আপনার রোল নম্বর"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  সিরিজ *
                </label>
                <select
                  name="series"
                  value={formData.series}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    সিরিজ নির্বাচন করুন
                  </option>
                  <option value="২৪">২৪</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  কলেজের নাম, জেলা *
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="যেমন: নটর ডেম কলেজ, ঢাকা"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  স্কুলের নাম, জেলা *
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="যেমন: রাজশাহী কলেজিয়েট স্কুল, রাজশাহী"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  হোমটাউন *
                </label>
                <input
                  type="text"
                  name="hometown"
                  value={formData.hometown}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="যেমন: রাজশাহী"
                  required
                />
              </div>
            </div>
            <button
              onClick={generateIntro}
              disabled={!isFormValid}
              className={`mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 ${
                isFormValid
                  ? "hover:shadow-xl"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              ইন্ট্রো তৈরি করুন
            </button>
          </div>

          {(vaiyaIntro || apuIntro) && (
            <div className="mt-8 space-y-8">
              {/* Vaiya Intro */}
              {vaiyaIntro && (
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center h-16 border-b border-gray-700 bg-gray-900 rounded-t-lg px-4">
                    <h2 className="text-2xl font-bold text-gray-200 self-center">
                      ভাইয়ের জন্য ইন্ট্রো
                    </h2>
                    <button
                      onClick={copyVaiyaToClipboard}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 self-center"
                    >
                      {vaiyaCopied ? "কপি করা হয়েছে!" : "কপি করুন"}
                    </button>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line mt-4 bg-gray-700 p-4 rounded-b-lg">
                    {vaiyaIntro}
                  </p>
                </div>
              )}
              {/* Apu Intro */}
              {apuIntro && (
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center h-16 border-b border-gray-700 bg-gray-900 rounded-t-lg px-4">
                    <h2 className="text-2xl font-bold text-gray-200 self-center">
                      আপুর জন্য ইন্ট্রো
                    </h2>
                    <button
                      onClick={copyApuToClipboard}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 self-center"
                    >
                      {apuCopied ? "কপি করা হয়েছে!" : "কপি করুন"}
                    </button>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line mt-4 bg-gray-700 p-4 rounded-b-lg">
                    {apuIntro}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <footer className="text-center py-6 bg-gradient-to-t from-black/80 to-transparent mt-8">
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-sm text-gray-300">
                Developed by{" "}
                <a
                  href="https://www.facebook.com/shuvo.chakma.16121/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  -Shuvo(61) ❤️
                </a>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                All rights reserved by ECE-23
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default IntroGenerator;
