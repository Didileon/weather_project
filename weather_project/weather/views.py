from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SearchHistory
from .serializers import SearchHistorySerializer
import requests
import urllib.parse

import urllib.parse
import logging

logger = logging.getLogger(__name__)

class WeatherView(APIView):
    def get(self, request):
        city = request.query_params.get('city')
        if not city:
            return Response({"error": "City required"}, status=400)

        encoded_city = urllib.parse.quote(city)
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={encoded_city}&count=1"

        logger.info(f"Запрашиваем координаты для города: {city}")
        logger.info(f"URL геолокации: {geo_url}")

        geo_response = requests.get(geo_url)
        logger.info(f"Статус ответа геолокации: {geo_response.status_code}")
        logger.info(f"Тело ответа геолокации: {geo_response.text}")

        geo = geo_response.json()

        if not geo.get("results"):
            logger.warning(f"Город не найден в результатах: {city}")
            return Response({"error": "City not found"}, status=404)

        lat = geo["results"][0]["latitude"]
        lon = geo["results"][0]["longitude"]

        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        logger.info(f"Запрос погоды: {weather_url}")

        weather = requests.get(weather_url).json()

        obj, created = SearchHistory.objects.get_or_create(city=city)
        if not created:
            obj.count += 1
            obj.save()

        return Response({"city": city, "weather": weather})
