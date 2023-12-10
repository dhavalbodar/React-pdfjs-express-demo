import React, { useEffect, useRef, useState } from "react";
import Child from "./Child";
import WebViewer from "@pdftron/pdfjs-express";

const pdfData = [
  {
    coordinates: [100, 200, 100, 200],
    page: 1,
  },
  {
    coordinates: [100, 200, 100, 200],
    page: 2,
  },
];

const Parent = () => {
  const viewer = useRef(null);
  const [viewerInstance, setViewerInstance] = useState(null);

  const handleAddAnnotation = () => {
    if (viewerInstance) {
      const { Annotations, annotationManager, documentViewer } =
        viewerInstance.Core;

      pdfData.forEach((obj) => {
        const { page, coordinates } = obj;
        const rectangleAnnot = new Annotations.RectangleAnnotation();
        rectangleAnnot.PageNumber = page;
        // values are in page coordinates with (0, 0) in the top left
        const [x, y, width, height] = coordinates;
        rectangleAnnot.X = x;
        rectangleAnnot.Y = y;
        rectangleAnnot.Width = width;
        rectangleAnnot.Height = height;
        rectangleAnnot.Author = annotationManager.getCurrentUser();

        annotationManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    }
  };

  const updateAnnotations = () => {
    if (viewerInstance) {
      const { Annotations, annotationManager, documentViewer } =
        viewerInstance.Core;
      const annotations = annotationManager.getAnnotationsList();
      const tempAnnotations = annotations[1];
      console.log("tempAnnotations", tempAnnotations);
      console.log("After annotations", annotations);
      tempAnnotations.StrokeColor = new Annotations.Color(255, 0, 0);
      annotationManager.redrawAnnotation(tempAnnotations);
      console.log("before annotations", annotations);
    }
  };

  const handleViewer = () => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc:
          "https://au.int/sites/default/files/bids/36472-1._architectural_final.pdf",
      },
      viewer.current
    ).then((instance) => {
      console.log("instanc", instance);
      setViewerInstance(instance);
    });
  };

  const handleDeleteAnnotations = () => {
    if (viewerInstance) {
      const { Annotations, annotationManager, documentViewer } =
        viewerInstance.Core;
      const annotations = annotationManager.getAnnotationsList();
        const annotationToDelete = annotations[1]
      // Remove the annotation from the annotation manager
      annotationManager.deleteAnnotation(annotationToDelete);

      // Redraw the viewer after deletion to reflect the changes
      annotationManager.redrawAnnotation(annotationToDelete);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleViewer();
    }, 2000);
  }, []);

  return (
    <div>
      <button onClick={handleAddAnnotation}>Load Annotations</button>
      <button onClick={updateAnnotations}>update Annotations</button>
      <button onClick={handleDeleteAnnotations}>Delete Annotations</button>
      <Child viewer={viewer} />
    </div>
  );
};

export default Parent;
