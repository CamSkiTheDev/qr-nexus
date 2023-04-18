import React, { useEffect, useRef, useState } from "react";
import QrCode from "qrcode";
import { Pacifico } from "next/font/google";
import {
  TbCircleChevronDown,
  TbCircleChevronUp,
  TbDownload,
} from "react-icons/tb";
import { BlockPicker } from "react-color";
import Head from "next/head";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const [qrData, setQrData] = useState<string>("https://cameronlucas.dev");
  const [logoFile, setLogoFile] = useState<Blob>();
  const [qrColor, setQrColor] = useState<string>("#555555");
  const [bgColor, setBgColor] = useState<string>("#fff");

  const canvas = useRef<HTMLCanvasElement>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(true);

  const generateQrCode = (data: string) =>
    QrCode.toCanvas(canvas.current, data, {
      errorCorrectionLevel: "high",
      width: 300,
      margin: 1,
      version: 10,
      color: {
        dark: qrColor,
        light: bgColor,
      },
    });

  const handleQrCodeGeneration = () => {
    const context = canvas.current?.getContext("2d");

    if (!logoFile) return generateQrCode(qrData);

    if (context) {
      const img = new Image();
      img.onload = () => {
        if (canvas.current) {
          context.clearRect(0, 0, canvas.current.width, canvas.current.height);
          generateQrCode(qrData);
          context.drawImage(
            img,
            canvas.current.width / 2 - 64,
            canvas.current.height / 2 - 64,
            128,
            128
          );
        }
      };
      img.src = URL.createObjectURL(logoFile as any);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrData(e.target.value);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoFile(e.target.files?.[0]);
  };

  const downloadQr = () => {
    const imageData = canvas.current?.toDataURL("image/png");

    if (imageData) {
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = imageData;
      link.click();
    }
  };

  useEffect(() => {
    generateQrCode(qrData);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col justify-between items-center">
      <Head>
        <title>qrNexus - Free Simple QR Code Genarator</title>
        <meta name="description" content="Free Simple QR Code Genarator" />
        <meta property="og:url" content="https://qr-nexus.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="qrNexus - Free Simple QR Code Genarator"
        />
        <meta
          property="og:description"
          content="Free Simple QR Code Genarator"
        />
        <meta
          property="og:image"
          content="https://qr-nexus.vercel.app/qrcode.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="qr-nexus.vercel.app" />
        <meta property="twitter:url" content="https://qr-nexus.vercel.app/" />
        <meta
          name="twitter:title"
          content="qrNexus - Free Simple QR Code Genarator"
        />
        <meta
          name="twitter:description"
          content="Free Simple QR Code Genarator"
        />
        <meta
          name="twitter:image"
          content="https://qr-nexus.vercel.app/qrcode.png"
        />
      </Head>
      <div className="navbar bg-white">
        <a className="normal-case text-xl">qrNexus</a>
      </div>
      <div className="flex sm:flex-row my-12 flex-col p-4 mx-4 w-full max-w-5xl card bg-white">
        <figure className="flex-col sm:w-4/12">
          <h3
            className={`font-light text-4xl ${pacifico.className} text-blue-500`}
          >
            Scan Me
          </h3>
          <canvas ref={canvas} className="bg-white" />
          <button
            onClick={downloadQr}
            className="btn w-11/12 my-2 bg-green-500 border-green-500 text-white hover:bg-transparent hover:text-green-500"
          >
            Download <TbDownload className="mx-2" />
          </button>
        </figure>
        <div className="card-body sm:w-8/12">
          <h1 className="font-light text-4xl mx-2 my-2 normal-case">qrNexus</h1>
          <p className="font-extralight"></p>
          <div className="flex sm:flex-nowrap flex-wrap w-full justify-center items-center">
            <input
              type="text"
              placeholder="Website URL..."
              value={qrData}
              onChange={handleUrlChange}
              className="input input-bordered w-full max-w-xl bg-transparent"
            />
            <button
              onClick={handleQrCodeGeneration}
              className="btn w-full mt-2 sm:mt-0 sm:w-auto btn-outline hover:bg-blue-500 hover:text-white border-blue-500 text-blue-500 mx-2"
            >
              Generate QR Code
            </button>
          </div>
          <span
            className="cursor-pointer text-blue-500 self-end my-2"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            Advanced Options{" "}
            {showAdvancedOptions ? (
              <TbCircleChevronUp className="inline-block" />
            ) : (
              <TbCircleChevronDown className="inline-block" />
            )}
          </span>
          <div
            className={`ease-in-out duration-300 overflow-hidden ${
              showAdvancedOptions ? "h-auto" : "h-0"
            } flex-col`}
          >
            <div className="w-full flex items-center">
              <span className="mr-2">
                Logo/Image:
                <br />
                <span className="text-xs font-extralight">128px by 128px</span>
              </span>
              <input
                type="file"
                placeholder="Logo/Image Url"
                className="file-input file-input-bordered w-full bg-transparent"
                onChange={handleLogoChange}
              />
            </div>
            <div className="flex flex-col sm:flex-row w-full justify-center sm:justify-between">
              <div className="flex flex-col mt-6 items-center">
                <span className="text-center">QR Code Color</span>
                <BlockPicker
                  color={qrColor}
                  onChangeComplete={(color) => setQrColor(color.hex)}
                  className="mt-4"
                />
              </div>
              <div className="flex flex-col mt-6 items-center">
                <span className="text-center">Background Color</span>
                <BlockPicker
                  color={bgColor}
                  onChangeComplete={(color) => setBgColor(color.hex)}
                  className="mt-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="mb-4">
        Made with <span className="text-red-500">♥️</span> by{" "}
        <a href="https://cameronlucas.dev" target="_blank" rel="noreferrer">
          Cameron Lucas
        </a>
      </span>
    </div>
  );
}
