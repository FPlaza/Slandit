import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get() // GET /search?q=loquebuscas
  search(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return { subforums: [], users: [] };
    }

    return this.searchService.searchAll(query);
  }
}