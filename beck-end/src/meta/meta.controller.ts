import { Body, Controller, Delete, Get, Param, Post, Put,} from '@nestjs/common';
import { MetaService } from './meta.service';
import { MetaDto } from  './meta.dto';

@Controller('metas')
export class MetaController {
  constructor(private metaService: MetaService) {}

  @Get()
  async findAll() {
    return this.metaService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.metaService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.metaService.remove(id);
  }

  @Post()
  async create(@Body() dto: MetaDto) {
    return this.metaService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: MetaDto) {
    return this.metaService.update({ id, ...dto });
  }
}
