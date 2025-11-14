import { InversifyFastifyServer } from './core/server/index'

import { controller } from './core/decorators/class/controller'

import { Get } from './core/decorators/method/get'
import { Post } from './core/decorators/method/post'
import { Put } from './core/decorators/method/put'
import { Delete } from './core/decorators/method/delete'

import { Header } from './core/decorators/param/header'
import { Body } from './core/decorators/param/body'
import { Param } from './core/decorators/param/param'

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
