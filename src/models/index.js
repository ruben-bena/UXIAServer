const User = require('./User');
const Token = require('./Token');
const Registry = require('./Registry');
const Request = require('./Request');
const Response = require('./Response');
const Image = require('./Image');

// User - Token
User.hasOne(Token, { foreignKey: 'userId', onDelete: 'CASCADE' });
Token.belongsTo(User, { foreignKey: 'userId' });

// User - Registry
User.hasMany(Registry, { foreignKey: 'userId', onDelete: 'CASCADE' });
Registry.belongsTo(User, { foreignKey: 'userId' });

// User - Request
User.hasMany(Request, { foreignKey: 'userId', onDelete: 'CASCADE' });
Request.belongsTo(User, { foreignKey: 'userId' });

// Request - Response
Request.hasOne(Response, { foreignKey: 'requestId', onDelete: 'CASCADE' });
Response.belongsTo(Request, { foreignKey: 'requestId' });

// Request - Image
Request.hasOne(Image, { foreignKey: 'requestId', onDelete: 'CASCADE' });
Image.belongsTo(Request, { foreignKey: 'requestId' });

module.exports = {
    User,
    Token,
    Registry,
    Request,
    Response,
    Image
};