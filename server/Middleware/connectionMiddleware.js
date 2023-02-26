const fs = require('fs');
const path = require('path');
const redis = require('redis');
const createFileContent = (host, port) => {
  return `var redis = require("redis"),
  client = redis.createClient('${port}', '${host}');
  client.connect()
module.exports = client;`;
};

module.exports = {
  connect: async (req, res, next) => {
    const { redisName, port, host } = req.body;

    try {
      const Client = await redis.createClient({
        socket: {
          host: host,
          port: port,
        },
      });
      await Client.connect();

      fs.writeFileSync(
        path.resolve(__dirname, `../redisClients/${redisName}.js`),
        createFileContent(host, port),
        function (err) {
          throw 'error while creating client';
        }
      );

      res.locals.redisName = redisName;
      next();
    } catch (err) {
      next({
        log: 'Error when validating redis instance in connection Middleware',
        status: 500,
        message: {
          err: 'error while connection to redis, please check port and host',
        },
      });
    }
  },
  getInstances: (req, res, next) => {
    fs.readdir(
      path.resolve(__dirname, '../redisClients'),
      { withFileTypes: false },
      (err, files) => {
        if (err) {
          next({
            log: 'Error when reading all redis instances in getInstances Middleware',
            status: 500,
            message: {
              err: "couldn't fetch all please retry",
            },
          });
        } else {
          files = files.map((file) => file.slice(0, -3));
          res.locals.instancesArr = files;
          next();
        }
      }
    );
  },

  disconnectOne: (req, res, next) => {
    const { redisName } = req.params;
    fs.unlink(
      path.resolve(__dirname, `../redisClients/${redisName}.js`),
      function (err) {
        if (err) {
          next({
            log: 'error while deleting file in connectionMiddleware',
            status: 500,
            message: {
              err: 'could not find redis client to delete, please retry',
            },
          });
        }
      }
    ),
      next();
  },

  disconnectMany: (req, res, next) => {
    fs.readdir(path.resolve(__dirname, '../redisClients'), (err, files) => {
      if (err) {
        next({
          log: 'error while deleting all files in disconnectMany Middleware',
          status: 500,
          message: {
            err: 'could not find redis clients to delete, please retry',
          },
        });
      }
      for (let file of files) {
        fs.unlink(
          path.resolve(__dirname, `../redisClients/${file}`),
          function (err) {
            if (err) {
              next({
                log: 'error while deleting file in disconnectMany Middleware',
                status: 500,
                message: {
                  err: 'could not find redis clients to delete, please retry',
                },
              });
            }
          }
        );
      }
    });

    next();
  },
};
