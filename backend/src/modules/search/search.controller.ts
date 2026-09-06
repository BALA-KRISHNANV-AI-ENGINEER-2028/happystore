import { Controller, Get, Post, Delete, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public, Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get('shops')
  @ApiOperation({ summary: 'Search shops with optional geospatial filtering and open-now filter' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'radiusKm', required: false, type: Number, default: 10 })
  @ApiQuery({ name: 'openNow', required: false, type: Boolean })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['distance', 'rating', 'name'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  searchShops(
    @Query('q') query?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('radiusKm') radiusKm?: number,
    @Query('openNow') openNow?: string,
    @Query('category') category?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.searchShops(
      query || '',
      lat ? Number(lat) : undefined,
      lng ? Number(lng) : undefined,
      radiusKm ? Number(radiusKm) : 10,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      openNow === 'true',
      category,
      sortBy as 'distance' | 'rating' | 'name' | undefined,
    );
  }

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'Search products with filtering and sorting' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'shopId', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['price_asc', 'price_desc', 'rating'] })
  searchProducts(
    @Query('q') query?: string,
    @Query('category') category?: string,
    @Query('shopId') shopId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.searchProducts(
      query || '',
      category,
      shopId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      sortBy as 'price_asc' | 'price_desc' | 'rating' | undefined,
    );
  }

  @Public()
  @Get('autocomplete')
  @ApiOperation({ summary: 'Get search suggestions for shops and products' })
  @ApiQuery({ name: 'q', required: true })
  autocomplete(@Query('q') query: string) {
    return this.searchService.getAutocomplete(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  @ApiOperation({ summary: 'Get recent searches for the current user' })
  getRecentSearches(@CurrentUser() user: User) {
    return this.searchService.getRecentSearches(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('recent')
  @ApiOperation({ summary: 'Track a new search query' })
  addRecentSearch(@CurrentUser() user: User, @Body('query') query: string) {
    return this.searchService.trackSearch(user.id, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('recent')
  @ApiOperation({ summary: 'Clear recent search history' })
  clearRecentSearches(@CurrentUser() user: User) {
    return this.searchService.clearRecentSearches(user.id);
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Get popular search terms across all users' })
  getPopularSearches() {
    return this.searchService.getPopularSearches();
  }
}
