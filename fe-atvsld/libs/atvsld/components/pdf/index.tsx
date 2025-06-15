"use client"; // Mark as client-side component

import dynamic from "next/dynamic";




const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false, 
    loading: () => <p>Loading PDF Viewer...</p>,
  }
);

// export { PDFDocument } from "./document_demo2";
// export { PDFDocument } from "./document";
export { PDFDocument } from "./document_demo3";

export { PDFViewer };
