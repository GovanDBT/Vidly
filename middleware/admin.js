
module.exports = function(req, res, next) {
    // 401 - for unauthorized users (gave us the wrong token but is allowed to retry)
    // 403 = for forbidden users (valid token but not allowed access and can't retry)
    if(!req.user.isAdmin) return res.status(403).send('Access denied');
    next();
}