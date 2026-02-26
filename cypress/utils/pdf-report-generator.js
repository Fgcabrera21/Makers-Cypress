const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const STEP_DESCRIPTIONS = {
  '01_pagina_login': 'Página de login de Sauce Demo cargada. Formulario con Username, Password y botón LOGIN visible.',
  '02_credenciales_ingresadas': 'Credenciales válidas ingresadas. Usuario: standard_user, contraseña ingresada (enmascarada).',
  '03_login_exitoso_inventario': 'Login exitoso. Redirección a página de inventario. Título "Products" visible. Usuario autenticado.',
  '04_login_form_contrasena_incorrecta': 'Credenciales ingresadas: usuario correcto, contraseña incorrecta. Listo para validar rechazo.',
  '05_error_contrasena_incorrecta': 'Error mostrado: "Username and password do not match". Login rechazado correctamente. Permanece en login.',
  '06_formulario_vacio': 'Formulario de login vacío. Sin usuario ni contraseña. Validación de campos obligatorios.',
  '07_error_campos_obligatorios': 'Error de validación visible. La app requiere usuario y contraseña. Mensaje de error mostrado.',
};

function getStepDescription(stepName, customDesc) {
  if (customDesc) return customDesc;
  const normalized = stepName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  return STEP_DESCRIPTIONS[stepName] || STEP_DESCRIPTIONS[normalized] || stepName.replace(/_/g, ' ').replace(/^\d+_/, '');
}

function sanitizeFileName(name) {
  return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').substring(0, 100);
}

// Evita errores de codificación WinAnsi en fuentes estándar (mantiene Latin-1)
function sanitizeForPdf(str) {
  if (str == null) return '';
  return String(str).replace(/[\u0100-\uFFFF]/g, '?');
}

async function generateTestReportPdf(data, outputDir) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  const primaryColor = rgb(0.14, 0.32, 0.55);
  const secondaryColor = rgb(0.2, 0.45, 0.75);
  const textColor = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.95, 0.95, 0.95);
  const successGreen = rgb(0.13, 0.55, 0.13);
  const errorRed = rgb(0.8, 0.2, 0.2);

  // PORTADA
  const coverPage = pdfDoc.addPage([pageWidth, pageHeight]);
  const coverHeight = pageHeight;

  const isApiTest = data.isApiTest || false;
  coverPage.drawRectangle({ x: 0, y: coverHeight - 180, width: pageWidth, height: 180, color: primaryColor });
  coverPage.drawText('REPORTE DE PRUEBA', { x: margin, y: coverHeight - 80, size: 24, font: fontBold, color: rgb(1, 1, 1) });
  coverPage.drawText(isApiTest ? 'ReqRes.in API - Tests de Contrato - Cypress' : 'Sauce Demo - Smoke Test Login - Cypress', { x: margin, y: coverHeight - 105, size: 12, font: font, color: rgb(0.9, 0.9, 0.9) });
  coverPage.drawText('Caso de prueba:', { x: margin, y: coverHeight - 220, size: 10, font: font, color: rgb(0.5, 0.5, 0.5) });
  coverPage.drawText(data.testName, { x: margin, y: coverHeight - 240, size: 14, font: fontBold, color: textColor, maxWidth: contentWidth });

  const infoY = coverHeight - 300;
  coverPage.drawText(`Archivo: ${data.testFile}`, { x: margin, y: infoY, size: 9, font: font, color: textColor });
  coverPage.drawText(`Fecha: ${data.timestamp}`, { x: margin, y: infoY - 18, size: 9, font: font, color: textColor });
  coverPage.drawText(`Duración: ${(data.duration / 1000).toFixed(2)}s`, { x: margin, y: infoY - 36, size: 9, font: font, color: textColor });

  const statusColor = data.status === 'passed' ? successGreen : errorRed;
  const statusText = data.status === 'passed' ? 'PASSED' : 'FAILED';
  coverPage.drawRectangle({ x: margin, y: infoY - 70, width: 120, height: 28, color: statusColor });
  coverPage.drawText(statusText, { x: margin + 35, y: infoY - 62, size: 14, font: fontBold, color: rgb(1, 1, 1) });
  coverPage.drawText(`Total de pasos documentados: ${data.steps.length}`, { x: margin, y: infoY - 110, size: 10, font: font, color: textColor });

  coverPage.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 35, color: lightGray });
  coverPage.drawText(`${isApiTest ? 'ReqRes API' : 'Sauce Demo QA'} - Reporte generado automáticamente por Cypress`, { x: margin, y: 12, size: 8, font: font, color: rgb(0.5, 0.5, 0.5) });

  // PÁGINAS DE PASOS
  const maxImageHeight = 320;
  const maxImageWidth = contentWidth;

  for (let i = 0; i < data.steps.length; i++) {
    const step = data.steps[i];
    const stepPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    stepPage.drawRectangle({ x: 0, y: currentY - 35, width: pageWidth, height: 35, color: secondaryColor });
    stepPage.drawText(`PASO ${step.stepNumber}`, { x: margin, y: currentY - 25, size: 12, font: fontBold, color: rgb(1, 1, 1) });
    currentY -= 55;

    stepPage.drawText(step.name.replace(/_/g, ' ').replace(/^\d+_/, ''), { x: margin, y: currentY, size: 11, font: fontBold, color: primaryColor, maxWidth: contentWidth });
    currentY -= 20;

    const wrap = (s, w) => {
      const words = s.split(' ');
      const lines = [];
      let line = '';
      for (const word of words) {
        if ((line + word).length > w && line) { lines.push(line.trim()); line = ''; }
        line += (line ? ' ' : '') + word;
      }
      if (line) lines.push(line.trim());
      return lines;
    };
    const descLines = wrap(step.description, 72);
    for (const line of descLines.slice(0, 8)) {
      stepPage.drawText(sanitizeForPdf(line.trim()), { x: margin, y: currentY, size: 9, font: font, color: textColor, maxWidth: contentWidth });
      currentY -= 14;
    }
    currentY -= 15;

    if (step.apiData) {
      const api = step.apiData;
      const monoColor = rgb(0.25, 0.25, 0.35);
      const line = (txt, size = 8) => { stepPage.drawText(sanitizeForPdf(txt), { x: margin, y: currentY, size, font, color: monoColor, maxWidth: contentWidth }); currentY -= size + 4; };
      stepPage.drawText(sanitizeForPdf(`Request: ${api.method} ${api.url}`), { x: margin, y: currentY, size: 9, font: fontBold, color: primaryColor, maxWidth: contentWidth });
      currentY -= 14;
      if (api.requestBody && Object.keys(api.requestBody).length > 0) {
        stepPage.drawText('Body:', { x: margin, y: currentY, size: 8, font: fontBold, color: textColor }); currentY -= 12;
        const reqStr = JSON.stringify(api.requestBody, null, 2);
        for (const l of reqStr.split('\n').slice(0, 6)) { line(l.substring(0, 85)); }
        currentY -= 6;
      }
      stepPage.drawText(`Response: ${api.status}`, { x: margin, y: currentY, size: 9, font: fontBold, color: api.status >= 200 && api.status < 300 ? successGreen : rgb(0.7, 0.4, 0), maxWidth: contentWidth });
      currentY -= 12;
      if (api.responseBody) {
        const resStr = typeof api.responseBody === 'object' ? JSON.stringify(api.responseBody, null, 2) : String(api.responseBody);
        for (const l of resStr.split('\n').slice(0, 12)) { line(l.substring(0, 85)); }
      }
    } else {
      const screenshotPath = path.isAbsolute(step.screenshotPath) ? step.screenshotPath : path.join(process.cwd(), step.screenshotPath || '');
      if (fs.existsSync(screenshotPath)) {
        try {
          const imageBytes = fs.readFileSync(screenshotPath);
          const image = await pdfDoc.embedPng(imageBytes);
          const imgDims = image.scaleToFit(maxImageWidth, maxImageHeight);
          const imgX = margin + (maxImageWidth - imgDims.width) / 2;
          stepPage.drawImage(image, { x: imgX, y: currentY - imgDims.height, width: imgDims.width, height: imgDims.height });
        } catch {
          stepPage.drawText('[Imagen no disponible]', { x: margin, y: currentY, size: 9, font: font, color: rgb(0.7, 0.7, 0.7) });
        }
      } else {
        stepPage.drawText('[Captura no generada]', { x: margin, y: currentY, size: 9, font: font, color: rgb(0.7, 0.7, 0.7) });
      }
    }

    stepPage.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 25, color: lightGray });
    stepPage.drawText(`Paso ${step.stepNumber} de ${data.steps.length} | ${isApiTest ? 'ReqRes API' : 'Sauce Demo QA'}`, { x: margin, y: 8, size: 8, font: font, color: rgb(0.5, 0.5, 0.5) });
  }

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const fileName = `Reporte_${sanitizeFileName(data.testName)}_${Date.now()}.pdf`;
  const filePath = path.join(outputDir, fileName);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
}

module.exports = { generateTestReportPdf, getStepDescription };
