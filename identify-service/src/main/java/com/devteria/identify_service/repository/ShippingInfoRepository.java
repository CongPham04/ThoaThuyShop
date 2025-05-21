package com.devteria.identify_service.repository;

import com.devteria.identify_service.entity.ShippingInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingInfoRepository extends JpaRepository<ShippingInfo, Long> {
}