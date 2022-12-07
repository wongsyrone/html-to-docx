/* eslint-disable no-useless-escape */
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import addFilesToContainer from './src/html-to-docx';

const minifyHTMLString = (htmlString) => {
  try {
    if (typeof htmlString === 'string' || htmlString instanceof String) {
      const minifiedHTMLString = htmlString
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\r\n/g, ' ')
        .replace(/[\t]+\</g, '<')
        .replace(/\>[\t ]+\</g, '><')
        .replace(/\>[\t ]+$/g, '>');

      return minifiedHTMLString;
    }

    throw new Error('invalid html string');
  } catch (error) {
    return null;
  }
};

/** 
 * @param {string} htmlString clean html string equivalent of document content.
 * @param {string} headerHTMLString clean html string equivalent of header. Defaults to <p></p> if header flag is true
 * @param {?object} documentOptions see https://github.com/privateOmega/html-to-docx
 * @param {string} footerHTMLString clean html string equivalent of footer. Defaults to <p></p> if footer flag is true.
 * @returns {Promise<object>} { "type": "Blob"|"Buffer", "ins": Blob|Buffer } 
*/
async function generateContainer(
  htmlString,
  headerHTMLString,
  documentOptions = {},
  footerHTMLString
) {
  const zip = new JSZip();

  let contentHTML = htmlString;
  let headerHTML = headerHTMLString;
  let footerHTML = footerHTMLString;
  if (htmlString) {
    contentHTML = minifyHTMLString(contentHTML);
  }
  if (headerHTMLString) {
    headerHTML = minifyHTMLString(headerHTML);
  }
  if (footerHTMLString) {
    footerHTML = minifyHTMLString(footerHTML);
  }

  await addFilesToContainer(zip, contentHTML, documentOptions, headerHTML, footerHTML);

  // let myGlobal;
  // if (typeof globalThis !== "undefined") {
  //   myGlobal = globalThis;
  // } else if (typeof window !== "undefined") {
  //   myGlobal = window;
  // } else if (typeof global !== "undefined") {
  //   myGlobal = global;
  // } else if (typeof self !== "undefined") {
  //   myGlobal = self;
  // } else {
  //   throw new Error("Cannot find global object");
  // }
  console.log(`JSZip support: ${JSON.stringify(JSZip.support)}`);
  let jszipGenType = "";
  if (JSZip.support.blob) {
    jszipGenType = "blob";
  }else {
    throw new Error("JSZip does not support blob");
  }
  const buffer = await zip.generateAsync({ type: jszipGenType });
  let ret = {};
  if (jszipGenType === "blob") {
    // eslint-disable-next-line no-undef
    ret.ins = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    ret.type = "Blob";
    return ret;
  }
  // commented due to save to file functionality
  // if (Object.prototype.hasOwnProperty.call(myGlobal, 'Buffer')) {
  //   ret.ins = Buffer.from(new Uint8Array(buffer));
  //   ret.type = "Buffer";
  //   return ret;
  // }
  throw new Error(
    'Add blob support using a polyfill eg https://github.com/bjornstar/blob-polyfill'
  );
}

/**
 * Convert HTML text to a docx file and save it to the user's computer.
 * @param {string} fileName name of the file to be downloaded
 * @param {string} htmlString clean html string equivalent of document content.
 * @param {string} headerHTMLString clean html string equivalent of header. Defaults to <p></p> if header flag is true
 * @param {?object} documentOptions see https://github.com/privateOmega/html-to-docx
 * @param {string} footerHTMLString clean html string equivalent of footer. Defaults to <p></p> if footer flag is true.
 * @returns {Promise<undefined>} undefined if success, otherwise throws error
 */
async function saveHTML2DOCXFile(fileName, ...html_to_docx_args) {
  let {type: html_to_docx_type, ins: html_to_docx_result} = await generateContainer(...html_to_docx_args);
  if (html_to_docx_type === "Blob") {
    saveAs(html_to_docx_result, fileName);
  } else {
    throw new Error("saveHTML2DOCXFile only supports Blob");
  }
}

//export default generateContainer;
export default saveHTML2DOCXFile;
