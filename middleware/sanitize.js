import xss from 'xss';
import _ from 'lodash';

const sanitizeNoSQL = (obj) => {
  if (!_.isPlainObject(obj)) return obj;
  const clean = {};
  for (const key in obj) {
    // Skip dangerous keys like $gt, $ne, and dotted paths
    if (key.startsWith('$') || key.includes('.')) continue;
    clean[key] = sanitizeNoSQL(obj[key]);
  }
  return clean;
};

const sanitizeXSS = (obj) => {
  if (!_.isPlainObject(obj)) return obj;
  const clean = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      clean[key] = xss(value);
    } else if (Array.isArray(value)) {
      clean[key] = value.map((item) =>
        typeof item === 'string' ? xss(item) : item
      );
    } else if (_.isPlainObject(value)) {
      clean[key] = sanitizeXSS(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

const sanitizeMiddleware = (req, res, next) => {
  req.sanitizedQuery = sanitizeXSS(sanitizeNoSQL(req.query || {}));
  req.sanitizedBody = sanitizeXSS(sanitizeNoSQL(req.body || {}));
  next();
};

export default sanitizeMiddleware;
