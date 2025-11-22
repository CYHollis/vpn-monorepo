import { nacos } from '@pkgs/svcs-discovery'

nacos.registerServer('bms-bff', 'localhost', 3001)
