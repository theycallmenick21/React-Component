import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(() => {
    const env = loadEnv('', process.cwd())
    return {
        base: env.VITE_PUBLIC_URL,
        build: {
            target: 'esnext',
        },
        plugins: [
            react(),
            federation({
                exposes: {
                    './NavigatorUI': './src/App_Export',
                },
                filename: 'remoteEntry.js',
                name: 'conexiom-navigatorui',
                shared: ['react', 'react-dom', 'react-router-dom'],
            }),
        ],
        test: {
            coverage: {
                exclude: ['node_modules/', 'src/setupTests.tsx'],
                provider: 'v8',
                reporter: ['cobertura', 'html'],
            },
            environment: 'jsdom',
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/public/**',
                '**/.{idea,git,cache,output,temp}/**',
                '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc}.config.*',
            ],
            globals: true,
            include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
            setupFiles: './src/setupTests.tsx',
            testTimeout: 30000,
        },
    }
})
