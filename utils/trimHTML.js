const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export function trimHtml(htmlContent) {

    try{
        // Parse the HTML
        const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  // 1. Remove all style and class attributes
  doc.querySelectorAll('*').forEach(el => {
    el.removeAttribute('style');
    el.removeAttribute('class');
  });

  // 2 & 8. Remove unnecessary div structures and simplify table structure
  doc.querySelectorAll('div').forEach(div => {
    while (div.firstChild) {
      div.parentNode.insertBefore(div.firstChild, div);
    }
    div.parentNode.removeChild(div);
  });

  // 3. Remove SVG icons
  doc.querySelectorAll('svg').forEach(svg => svg.remove());

  // 4. Remove tooltip divs
  doc.querySelectorAll('.th-tooltip').forEach(tooltip => tooltip.remove());


  // 6. Remove thead and tbody tags
  ['thead', 'tbody'].forEach(tag => {
    doc.querySelectorAll(tag).forEach(el => {
      while (el.firstChild) {
        el.parentNode.insertBefore(el.firstChild, el);
      }
      el.parentNode.removeChild(el);
    });
  });

  // 7. Remove data attributes
  doc.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // 9. Remove empty cells or rows
  doc.querySelectorAll('td, tr').forEach(el => {
    if (!el.textContent.trim()) {
      el.remove();
    }
  });

  // 10. Remove script tags
  doc.querySelectorAll('script').forEach(script => script.remove());

  // Convert back to string and remove extra whitespace
  let cleanedHtml = doc.body.innerHTML;
  cleanedHtml = cleanedHtml.replace(/\s+/g, ' ');
  cleanedHtml = cleanedHtml.replace(/> </g, '><');
  console.log({cleanedHtml})
  return cleanedHtml;
    }catch(e){
        console.log({e})
    }
  
}
