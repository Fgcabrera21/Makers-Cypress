const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { generateTestReportPdf, getStepDescription } = require('../utils/pdf-report-generator');

const STEPS_CACHE_DIR = path.join(process.cwd(), 'test-results', 'steps-cache');
const PDF_REPORTS_DIR = path.join(process.cwd(), 'test-results', 'pdf-reports');

function getTestCacheId(specRelative, testTitle) {
  const normalized = (specRelative || '').replace(/\\/g, '/');
  const raw = `${normalized}-${testTitle}`;
  return crypto.createHash('md5').update(raw).digest('hex').slice(0, 16);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

module.exports = (on, config) => {
  ensureDir(STEPS_CACHE_DIR);
  ensureDir(PDF_REPORTS_DIR);

  function findScreenshot(screenshotName) {
    const base = path.join(process.cwd(), 'test-results', 'step-screenshots');
    if (!fs.existsSync(base)) return null;
    const search = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isFile() && e.name === screenshotName) return full;
        if (e.isDirectory()) {
          const found = search(full);
          if (found) return found;
        }
      }
      return null;
    };
    return search(base);
  }

  on('task', {
    recordStep({ specRelative, testTitle, stepName, description }) {
      const cacheId = getTestCacheId(specRelative, testTitle);
      const cacheFile = path.join(STEPS_CACHE_DIR, `${cacheId}.json`);
      let data = { testName: testTitle, testFile: path.basename(specRelative || ''), steps: [], isApiTest: false };
      if (fs.existsSync(cacheFile)) {
        try {
          data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        } catch (e) { /* ignore */ }
      }
      const stepNum = data.steps.length + 1;
      const screenshotName = `step_${stepNum}_${stepName}.png`;
      data.steps.push({
        stepNumber: stepNum,
        name: stepName,
        description: description || getStepDescription(stepName),
        screenshotName
      });
      fs.writeFileSync(cacheFile, JSON.stringify(data), 'utf-8');
      return { stepNum, screenshotName };
    },
    recordApiStep({ specRelative, testTitle, stepName, method, url, requestBody, status, responseBody }) {
      const cacheId = getTestCacheId(specRelative, testTitle);
      const cacheFile = path.join(STEPS_CACHE_DIR, `${cacheId}.json`);
      let data = { testName: testTitle, testFile: path.basename(specRelative || ''), steps: [], isApiTest: true };
      if (fs.existsSync(cacheFile)) {
        try {
          data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        } catch (e) { /* ignore */ }
      }
      data.isApiTest = true;
      const stepNum = data.steps.length + 1;
      data.steps.push({
        stepNumber: stepNum,
        name: stepName,
        description: `${method} ${url} -> ${status}`,
        apiData: { method, url, requestBody, status, responseBody }
      });
      fs.writeFileSync(cacheFile, JSON.stringify(data), 'utf-8');
      return { stepNum };
    }
  });

  on('after:run', async (results) => {
    if (!fs.existsSync(STEPS_CACHE_DIR)) return;
    const files = fs.readdirSync(STEPS_CACHE_DIR).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const cacheFile = path.join(STEPS_CACHE_DIR, f);
      try {
        const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        if (!data.steps || data.steps.length === 0) {
          fs.unlinkSync(cacheFile);
          continue;
        }
        const stepsWithPath = data.steps.map(s => {
          if (s.apiData) return s; // paso API, sin screenshot
          return {
            ...s,
            screenshotPath: findScreenshot(s.screenshotName) || path.join(process.cwd(), 'test-results', 'step-screenshots', s.screenshotName)
          };
        });
        const pdfPath = await generateTestReportPdf(
          {
            testName: data.testName,
            testFile: data.testFile,
            status: 'passed',
            duration: 0,
            steps: stepsWithPath,
            isApiTest: data.isApiTest || false,
            timestamp: new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'medium' })
          },
          PDF_REPORTS_DIR
        );
        console.log(`   📄 Reporte PDF: ${path.relative(process.cwd(), pdfPath)}`);
      } catch (err) {
        console.warn(`   ⚠ Error generando PDF para ${f}:`, err.message);
      } finally {
        try {
          if (fs.existsSync(cacheFile)) fs.unlinkSync(cacheFile);
        } catch (e) { /* ignore */ }
      }
    }
  });
};
