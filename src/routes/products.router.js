import { Router } from 'express';
import {__dirname} from '../utils.js';
import * as controller from '../controllers/productController.js';

const router = Router();

router.get('/', controller.getAll)
router.get('/:pid', controller.getById)
router.post('/', controller.create)
router.put('/:pid', controller.update)
router.delete('/:pid', controller.remove)

export default router;