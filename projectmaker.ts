import inquirer from 'inquirer'
import { execSync } from 'child_process'

interface Answers {
  projectName: string
  framework: string
  useTailwind: boolean
  confirmCreation: 'Yes' | 'No'
  nextJsFolder: string
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
    choices: ['react-ts', 'next-js'],
    default: 'react-ts',
  },
  {
    type: 'input',
    name: 'nextJsFolder',
    message: 'Enter the directory name for the Next.js project (only for Next.js projects):',
    when: (answers) => answers.framework === 'next-js',
  },
  {
    type: 'list',
    name: 'useTailwind',
    message: 'Do you want to use TailwindCSS?',
    choices: ['Yes', 'No'],
    default: 'Yes',
    when: (answers) => answers.framework === 'react-ts'
  },
  {
    type: 'list',
    name: 'confirmCreation',
    message: 'Do you want to create this project?',
    choices: ['Yes', 'No'], 
    default: 'Yes'
  }
]).then(answers => {
  const { projectName, framework, useTailwind, confirmCreation, nextJsFolder } = answers

  if (confirmCreation === 'Yes') {
    console.log(`Creating your ${framework} project: ${projectName}`)
    
    try {
      if (framework === 'react-ts') {
        execSync(`npm create vite@latest ${projectName} -- --template react-ts`, { stdio: 'inherit' })
      } else if (framework === 'next-js') {
        execSync(`npx create-next-app@latest ${nextJsFolder || projectName} -y`, { stdio: 'inherit' })
      }

      process.chdir(nextJsFolder || projectName)
      console.log('Installing dependencies...')
      execSync('npm install', { stdio: 'inherit' })
      
      if (useTailwind) {
        console.log('Setting up TailwindCSS...')
        execSync('npm install -D tailwindcss', { stdio: 'inherit' })
        execSync('npx tailwindcss init', { stdio: 'inherit' })

        console.log(`
          TailwindCSS setup almost done! Add the following to your main CSS file (e.g., src/index.css):
          
          @tailwind base
          @tailwind components
          @tailwind utilities

          Don't forget to update 'tailwind.config.js' to include your project paths.
        `)
      }

      console.log('Project setup is complete. Happy coding!')
    } catch (error) {
      console.error('Error during project setup')
    }
  }
})
