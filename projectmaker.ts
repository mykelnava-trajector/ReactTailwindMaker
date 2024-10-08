import inquirer from 'inquirer';
import { execSync } from 'child_process';

interface Answers {
  projectName: string;
  framework: string;
  useTailwind: boolean;
  confirmCreation: 'Yes' | 'No';
}

inquirer.prompt<Answers>([
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter your project name:',
  },
  {
    type: 'list',
    name: 'framework',
    message: 'Choose your project type:',
    choices: ['react-ts'],
    default: 'react-ts',
  },
  {
    type: 'list',
    name: 'useTailwind',
    message: 'Do you want to use TailwindCSS?',
    choices: ['Yes','No'],
    default: 'Yes'
  },
  {
    type: 'list',
    name: 'confirmCreation',
    message: 'Do you want to create this project?',
    choices: ['Yes', 'No'], 
    default: 'Yes'
  }
]).then(answers => {
  const { projectName, framework, useTailwind, confirmCreation } = answers

  if (confirmCreation === 'Yes') {
    console.log(`Creating your ${framework} project: ${projectName}`)
    
    execSync(`npm create vite@latest ${projectName} -- --template ${framework}`)

    process.chdir(projectName)

    console.log('Installing dependencies...');
    execSync('npm install');

    if (useTailwind) {
      console.log('Setting up TailwindCSS...');
      execSync(`npm install -D tailwindcss`);
      execSync(`npx tailwindcss init`);

      console.log(`
        TailwindCSS setup almost done! Add the following to your main CSS file (e.g., src/index.css):
        
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        Don't forget to update 'tailwind.config.js' to include your project paths.
      `)
    }
    console.log('Project setup is complete. Happy coding!')
  } else {
    console.log('Project creation canceled.')
  }
})