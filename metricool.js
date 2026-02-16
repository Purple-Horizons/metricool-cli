#!/usr/bin/env node

import { Command } from 'commander';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://app.metricool.com/api';

// Auth credentials from environment
const USER_TOKEN = process.env.METRICOOL_USER_TOKEN;
const USER_ID = process.env.METRICOOL_USER_ID;
const DEFAULT_BLOG_ID = process.env.METRICOOL_BLOG_ID;

// Helper: Add auth params to URL
function addAuthParams(url, blogId = null) {
  const params = new URLSearchParams();
  params.set('userToken', USER_TOKEN);
  params.set('userId', USER_ID);
  if (blogId) params.set('blogId', blogId);
  return `${url}?${params.toString()}`;
}

// Helper: Make authenticated request
async function apiRequest(endpoint, options = {}, blogId = null) {
  const url = addAuthParams(`${BASE_URL}${endpoint}`, blogId);
  const headers = {
    'Content-Type': 'application/json',
    'X-Mc-Auth': USER_TOKEN,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const text = await response.text();
    
    if (!response.ok) {
      console.error(`API Error [${response.status}]:`, text);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Try to parse as JSON, return text if it fails
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

// Commands

async function listBrands() {
  const data = await apiRequest('/admin/simpleProfiles');
  console.log(JSON.stringify(data, null, 2));
}

async function getBestTime(blogId) {
  const id = blogId || DEFAULT_BLOG_ID;
  if (!id) throw new Error('blogId required (use --blog-id or set METRICOOL_BLOG_ID)');
  
  const data = await apiRequest('/planner/best-time-to-publish', {}, id);
  console.log(JSON.stringify(data, null, 2));
}

async function listPosts(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  
  const queryString = params.toString();
  const endpoint = `/v2/scheduler/posts${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  console.log(JSON.stringify(data, null, 2));
}

async function createPost(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  // Convert comma-separated networks to provider objects
  const networks = options.network ? options.network.split(',').map(n => n.trim()) : [];
  const providers = networks.map(network => ({ network }));

  // Parse media URLs if provided
  const media = options.media ? options.media.split(',').map(m => m.trim()) : [];

  // Build post data
  const postData = {
    text: options.text || '',
    providers,
    publicationDate: {
      date: options.date || new Date().toISOString(),
      timezone: options.timezone || 'America/New_York',
    },
    draft: options.draft || false,
    autoPublish: !options.draft,
    media,
  };

  // Add first comment if provided
  if (options.firstComment) {
    postData.firstCommentText = options.firstComment;
  }

  // Add LinkedIn-specific data
  if (options.linkedinType) {
    postData.linkedinData = {
      postType: options.linkedinType,
    };
  }

  // Add Instagram-specific data
  if (options.instagramType) {
    postData.instagramData = {
      postType: options.instagramType,
    };
  }

  const data = await apiRequest('/v2/scheduler/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }, blogId);

  console.log(JSON.stringify(data, null, 2));
}

async function updatePost(id, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const updateData = {};
  
  if (options.text) updateData.text = options.text;
  if (options.date) {
    updateData.publicationDate = {
      date: options.date,
      timezone: options.timezone || 'America/New_York',
    };
  }
  if (options.network) {
    const networks = options.network.split(',').map(n => n.trim());
    updateData.providers = networks.map(network => ({ network }));
  }
  if (options.media) {
    updateData.media = options.media.split(',').map(m => m.trim());
  }

  const data = await apiRequest(`/v2/scheduler/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }, blogId);

  console.log(JSON.stringify(data, null, 2));
}

async function deletePost(id, blogId) {
  const bid = blogId || DEFAULT_BLOG_ID;
  if (!bid) throw new Error('blogId required');

  await apiRequest(`/v2/scheduler/posts/${id}`, {
    method: 'DELETE',
  }, bid);

  console.log(`Post ${id} deleted successfully`);
}

async function getStats(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  // Map network to appropriate endpoint
  const endpoints = {
    instagram: '/v2/analytics/instagram/profile',
    facebook: '/v2/analytics/facebook/profile',
    twitter: '/v2/analytics/twitter/profile',
    linkedin: '/v2/analytics/linkedin/profile',
    tiktok: '/v2/analytics/tiktok/profile',
    youtube: '/v2/analytics/youtube/profile',
  };

  const endpoint = endpoints[network.toLowerCase()];
  if (!endpoint) {
    throw new Error(`Unknown network: ${network}. Available: ${Object.keys(endpoints).join(', ')}`);
  }

  const data = await apiRequest(endpoint, {}, blogId);
  console.log(JSON.stringify(data, null, 2));
}

async function uploadMedia(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const { url, filename } = options;
  
  if (!url) throw new Error('--url required');

  // Step 1: Create upload transaction
  const transaction = await apiRequest('/v2/media/s3/upload-transactions', {
    method: 'PUT',
    body: JSON.stringify({
      filename: filename || url.split('/').pop(),
      contentType: 'image/jpeg', // Default, could be smarter
    }),
  }, blogId);

  console.log('Upload transaction created:', transaction);
  
  // Note: Actual S3 upload would happen here with presigned URL
  // For now, just return the transaction info
  return transaction;
}

async function normalizeImageUrl(url, blogId) {
  const bid = blogId || DEFAULT_BLOG_ID;
  if (!bid) throw new Error('blogId required');

  const params = new URLSearchParams({ url });
  const endpoint = `/actions/normalize/image/url?${params.toString()}`;
  
  const normalizedUrl = await apiRequest(endpoint, {}, bid);
  console.log(normalizedUrl);
  return normalizedUrl;
}

// CLI Setup

const program = new Command();

program
  .name('metricool')
  .description('Metricool CLI - manage social media posts via Metricool API')
  .version('1.0.0');

// Brands command
program
  .command('brands')
  .description('List all brands/profiles')
  .action(listBrands);

// Best time command
program
  .command('best-time')
  .description('Get best time to publish')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(getBestTime);

// Post commands
const post = program.command('post').description('Manage scheduled posts');

post
  .command('list')
  .description('List scheduled posts')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone (e.g., America/New_York)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(listPosts);

post
  .command('create')
  .description('Create a new scheduled post')
  .option('-t, --text <text>', 'Post text content')
  .option('-n, --network <networks>', 'Networks (comma-separated: linkedin,instagram,twitter)')
  .option('-m, --media <urls>', 'Media URLs (comma-separated)')
  .option('-d, --date <datetime>', 'Publication date (ISO 8601)')
  .option('-z, --timezone <tz>', 'Timezone', 'America/New_York')
  .option('--draft', 'Create as draft')
  .option('--linkedin-type <type>', 'LinkedIn post type (POST, poll)')
  .option('--instagram-type <type>', 'Instagram post type (POST, REEL, STORY)')
  .option('--first-comment <text>', 'First comment text')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(createPost);

post
  .command('update <id>')
  .description('Update a scheduled post')
  .option('-t, --text <text>', 'New post text')
  .option('-n, --network <networks>', 'Networks (comma-separated)')
  .option('-m, --media <urls>', 'Media URLs (comma-separated)')
  .option('-d, --date <datetime>', 'New publication date (ISO 8601)')
  .option('-z, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(updatePost);

post
  .command('delete <id>')
  .description('Delete a scheduled post')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action((id, options) => deletePost(id, options.blogId));

// Stats command
program
  .command('stats <network>')
  .description('Get network statistics')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(getStats);

// Media commands
const media = program.command('media').description('Manage media uploads');

media
  .command('upload')
  .description('Upload media file')
  .option('-u, --url <url>', 'Media URL')
  .option('-f, --filename <name>', 'Filename')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(uploadMedia);

media
  .command('normalize <url>')
  .description('Normalize external image URL to Metricool-hosted URL')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action((url, options) => normalizeImageUrl(url, options.blogId));

// Parse and execute
program.parse();
