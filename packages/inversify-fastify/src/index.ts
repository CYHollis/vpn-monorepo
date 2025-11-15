import { InversifyFastifyServer } from './server/index.js'

import { controller } from './decorators/class/controller.js'

import { Get } from './decorators/method/get.js'
import { Post } from './decorators/method/post.js'
import { Put } from './decorators/method/put.js'
import { Delete } from './decorators/method/delete.js'

import { Header } from './decorators/param/header.js'
import { Body } from './decorators/param/body.js'
import { Param } from './decorators/param/param.js'

export {
    InversifyFastifyServer,
    controller,
    Get,
    Post,
    Put,
    Delete,
    Header,
    Body,
    Param
}
