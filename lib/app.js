const path = require('path');
const fs = require('fs');
const commander = require('commander');
const chalk = require('chalk');
const { spawnSync } = require('child_process');
const packageJson = require('../package.json');

let projectName;

const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments("<projectName>")
    .usage(`${chalk.green('<projectName>')} [options]`)
    .action( (name) => {
        projectName = name;
    })
    .option("-e, --eject", "Npm run eject after create-react-app executed")
    .parse(process.argv);    

if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
        `   ${chalk.cyan(program.name())} ${chalk.green('<projectName>')}`
    );
    console.log();
    console.log('For example:');
    console.log(`   ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`);
    console.log();
    console.log(
        `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
}

function createApp(name) {
    const root = path.resolve(projectName);
    const appName = path.basename(root);

    if (fs.existsSync(root)) {
        console.log('A project name with the same name exists.');
        process.exit(1);
    }

    const child = spawnSync('create-react-app', [appName], { 'stdio': 'inherit', shell: true  });

    if (child.status !== 0) {
        console.error(`${chalk.red('Error occurred something else.')}`);
        process.exit(1);
    }

    if (program.eject) {
        process.chdir(root);

        spawnSync('npm', ['run', 'eject'], { stdio: 'inherit', shell: true });
    }
}

createApp(projectName);
