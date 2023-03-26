// import { NextFunction, Request, Response } from 'express';
// const apikey = 'bda9eec0eedbfd2eaab32527f805375af8606ba44c2b13acfebbbdf8e843108f';

// if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// const readFilePromise = util.promisify(fs.readFile);

// export default function (args) {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const { path, hash } = args;
//             const { file, files } = req;
//             if (!file && !Object.values(files || {})) return res.badRequest('File is empty');

//             var data = [file, ...Object.values(files || {})].filter(Boolean);

//             if (!data.length || data.length > 5) return res.badRequest(undefined, { info: 'file_length_not_match' });

//             const scanned = await Promise.all(data.map(scanFile));
//             if (scanned.some(result => !result)) return res.forbidden('Damaged file detected');

//             const filenames = hash
//                 ? data.map(f => `${generateUUID().split('-').join('')}.${f.mimetype?.split('/').pop()}`)
//                 : data.map(f => `${f.originalname}`);

//             const payload = data.map((file, index) => ({
//                 ACL: 'public-read',
//                 Bucket: config.aws.bucket,
//                 Key: `${config.aws.sub_folder}/assets/${path}/${filenames[index]}`,
//                 Body: fs.readFileSync(file.path),
//                 ServerSideEncryption: 'AES256',
//             }));

//             await Promise.all(payload.map(object => getS3Client().putObject(object).promise()));

//             req.image = filenames[0];
//             req.images = filenames;
//             next();
//         } catch (error) {
//             logger.error(error);
//             return res.serverInternalError(error.message);
//         } finally {
//             data && setTimeout(() => data.map(f => fs.unlinkSync(f.path)));
//         }
//     };
// }

// async function scanFile(file) {
//     try {
//         const response: any = await fileScan(file);
//         if (!response) throw new Error('scan file error');
//         const { id } = response.data;
//         if (id) {
//             const { data } = await axios.get('https://www.virustotal.com/api/v3/analyses/' + id, {
//                 headers: { accept: 'application/json', 'x-apikey': apikey },
//             });
//             const { attributes } = data.data;
//             console.log('malicious', attributes.stats.malicious);
//             if (attributes.stats?.harmless > 0 || attributes.stats?.malicious > 0) {
//                 logger.error(`============= Upload Virus file =============`);
//                 return false;
//             }
//             return true;
//         }
//         return false;
//     } catch (error) {
//         console.log('scanFile', error);
//         return false;
//     }
// }

// async function fileScan(file, fileName = 'unknown') {
//     try {
//         const data = await readFilePromise(file.path);

//         const payload = {
//             file: {
//                 buffer: data,
//                 filename: fileName,
//                 content_type: 'application/octet-stream',
//             },
//         };

//         const options = {
//             compressed: true, // sets 'Accept-Encoding' to 'gzip,deflate'
//             follow_max: 5, // follow up to five redirects
//             rejectUnauthorized: true, // verify SSL certificate
//             multipart: true,
//             timeout: 2 * 60 * 1000,
//             user_agent: 'virustotal-api',
//             headers: { 'X-Apikey': apikey },
//         };

//         return new Promise((resolve, reject) => {
//             needle.post('https://www.virustotal.com/api/v3/files', payload, options, (err, res, body) => {
//                 if (err) reject(err);
//                 else resolve(body);
//             });
//         });
//     } catch (error) {
//         console.log('fileScan', error);
//         return false;
//     }
// }
