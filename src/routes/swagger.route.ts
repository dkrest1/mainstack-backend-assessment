import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { swaggerDefinition } from '@/modules/swagger'

const router = express.Router()

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/modules/swagger/components.yaml', 'src/routes/*.route.ts'],
})

router.use('/', swaggerUi.serve)
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  }),
)

export default router
