/**
 * Send response to client
 * @param {object} res - response object
 * @param {object} options - response options
 * @param {object} options.data - data to send
 * @param {number} options.status - status code
 * @param {string} options.contentType - content type
 * @returns {void}
 */
export const send_response = (
  res,
  { data = {}, status = 200, contentType: content_type = 'application/json' },
) => {
  res.writeHead(status, { 'Content-Type': content_type });
  const content =
    content_type === 'application/json' ? JSON.stringify(data) : data;
  res.write(content);
  res.end();
};
