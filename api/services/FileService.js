var path = require('path');
var md5 = require('md5');
var Promise = require('promise');
var fs = require('fs-extra');
var im = require('imagemagick');

class FileService {

	uploadFile(req, res, param, allowedTypes, dirname, maxBytes) {
		return new Promise(function (resolve, reject) {
			req.file(param).upload(
				{
					maxBytes: maxBytes,
					saveAs: function(file, cb) {
						cb(null, dirname);
					}
				}, function(err, uploadedFIle) {
				if (!uploadedFIle || uploadedFIle.length == 0) {
					reject('No file sent');
				} else {
					resolve(req.body);
			    }
			})
		})
	}

	generateThumb(source, dest, cb) {
		var filename = source.replace(/^.*[\\\/]/, '');
		var thumb = require('node-thumbnail').thumb;
		fs.mkdirsSync(dest, {clobber:false});
		thumb({
		  suffix: '',
		  source: source, // could be a filename: dest/path/image.jpg 
		  destination: dest,
		  concurrency: 2,
		  width: 200,
		}, () => {
			var assetsOri = path.resolve(__dirname, '../../assets/' + sails.config.media.imageDir + filename)
			var assetsThumb = path.resolve(__dirname, '../../assets/' + sails.config.media.thumbDir + filename);
		  	fs.copySync(source, assetsOri);
		  	fs.copySync(path.resolve(dest + '/' + filename), assetsThumb);
		  	cb();
		});
	}
	
	generateScreenshot(source, dest, cb) {
		var filename = source.replace(/^.*[\\\/]/, '');
		var thumbler = require('video-thumb');
		fs.ensureDirSync(path.resolve(__dirname, '../../.tmp/public/' + sails.config.media.videoThumbDir));
		thumbler.extract(source, dest, '00:00:10', '200x125', () => {
			var assetsOri = path.resolve(__dirname, '../../assets/' + sails.config.media.videoDir + filename);
			var assetsThumb = path.resolve(__dirname, '../../assets/' + sails.config.media.videoThumbDir + dest.replace(/^.*[\\\/]/, ''));
		  	fs.copySync(source, assetsOri);
		  	fs.copySync(dest, assetsThumb);
		  	cb();
		});
	}

	deleteFile(files, cb) {
		var deleted = 0;
		files.forEach((file) => {
			fs.unlink(file, (err) => {
				deleted += 1;
				if (deleted === files.length)
				cb();
			});
		});
	}

	resizeImageQuality(source){
		return new Promise(function (resolve, reject) {
			im.resize({
			 	srcData: fs.readFileSync(source, 'binary'),
			 	quality: 0.8,
			 	width: 1280
			}, function(err, stdout, stderr){
			  	if (err) reject(err);
			  	fs.outputFileSync(source, stdout, 'binary');
			  	resolve(source);
			});
		});
	}

}

module.exports = new FileService();