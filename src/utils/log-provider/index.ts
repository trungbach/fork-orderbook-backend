import * as fs from 'fs';
import * as util from 'util';
import * as moment from 'moment';
import config from '../../config';

const folderLogs = `${config.basedir}logs/`;
if (!fs.existsSync(folderLogs)){
  console.log('CREATE FOLDER LOGS');
  fs.mkdirSync(folderLogs);
}
const logStdout = process.stdout;

export function logConsole(d) {
  logStdout.write(util.format(d) + '\n');
}

function logFile(d, file) {
  let logText = '';
  for (const i in d) {
    logText += util.format(d[i]) + ' -- ';
  }
  fs.appendFileSync(file, moment().format('YYYY-MM-DD HH:mm:ss') + ': ' + logText.slice(0, -4) + '\n');
}

function openFile(fileName) {
  return `${folderLogs}${moment().format('YYYYMMDD')}_${fileName}.log`;
}

export function logInfo(...d) {
  logFile(d, openFile('info'));
}

export function logError(...d) {
  logFile(d, openFile('error'));
}

export function logInfoConsole(...d) {
  logFile(d, openFile('info'));
  logConsole(d);
}

export function logErrorConsole(...d) {
  logFile(d, openFile('error'));
  logConsole(d);
}

export function logFileName(fileName, ...d) {
  logFile(d, openFile(fileName));
}
