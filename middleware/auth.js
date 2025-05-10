import jwt from "jsonwebtoken";

const authenticated = (req, res, next) => {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ error: "Access denied!" });
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode; // req.user will contain user info
    next();
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Invalid or expired token!" });
  }
};

const authorize = (roles =[]) => {
  return (req, res, next) => {
    try {
      const user = req.user
      // Check if user info is available
      if (!user) return res.status(401).json({ error: "User not authenticated!" });

      // Check if the user's role is included in the allowed roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Access denied! You do not have permission." }); // 403 Forbidden for insufficient privileges
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: "Access denied! Unauthorized access." });
    }
  };
};
export { authorize, authenticated };
